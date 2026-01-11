import NiceModal from "@ebay/nice-modal-react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import { useReducedMotion } from "@/hook/useReducedMotion";
import type { Player } from "@/lib/player";
import { settings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { HeroComponent } from "./Hero";

export const PlayerComponent = observer(
	({ upsideDown, player }: { upsideDown?: boolean; player: Player }) => {
		const useVerticalButtons = settings.verticalButtons;

		const longPressActivated = useRef(false);
		const timerRef = useRef<number>(0);

		const [life, setLife] = useState(player.currentLife);
		const lifeRef = useRef(player.currentLife);

		const lifeModifyTimer = useRef<number>(0);

		const [didIncrease, setDidIncrease] = useState(false);

		const prefersReducedMotion = useReducedMotion();

		const updateHealth = () => {
			if (lifeModifyTimer.current !== 0) {
				clearTimeout(lifeModifyTimer.current);
			}

			lifeModifyTimer.current = setTimeout(() => {
				player.currentLife = lifeRef.current;
				lifeModifyTimer.current = 0;
			}, 1000);
		};

		const touchStart = (e: TouchEvent | MouseEvent, increase: boolean) => {
			e.preventDefault();

			if (timerRef.current !== 0) return;

			updateHealth();
			setDidIncrease(increase);
			longPressActivated.current = false;

			const doLongPress = () => {
				longPressActivated.current = true;

				const n = Math.max(
					0,
					lifeRef.current + (increase ? 1 : -1) * 5,
				);
				lifeRef.current = n;
				setLife(n);

				if ("vibrate" in navigator) {
					navigator.vibrate(50);
				}

				updateHealth();
				timerRef.current = setTimeout(doLongPress, 300);
			};

			timerRef.current = setTimeout(doLongPress, 300);
		};

		const touchEnd = (e: TouchEvent | MouseEvent, increase: boolean) => {
			e.preventDefault();

			if (!longPressActivated.current) {
				const n = Math.max(0, life + (increase ? 1 : -1));
				lifeRef.current = n;
				setLife(n);

				if (settings.vibrateAll && "vibrate" in navigator) {
					navigator.vibrate(5);
				}
			}

			clearTimeout(timerRef.current);
			timerRef.current = 0;

			updateHealth();
		};

		const touchCancel = () => {
			clearTimeout(timerRef.current);
			timerRef.current = 0;
			updateHealth();
		};

		const openLifeHistory = () => {
			NiceModal.show("lifeHistory", { player });
		};

		return (
			<div
				className={cn(
					"relative w-full h-full select-none",
					upsideDown ? "rotate-180" : "",
				)}
			>
				{!prefersReducedMotion ? (
					<div
						key={life}
						className={cn(
							"absolute top-0 left-0 bottom-0 right-0 w-full h-full z-20 bg-radial from-transparent animate-hit from-80% pointer-events-none",
							didIncrease ? "to-green-500" : "to-red-500",
							life === 0 ? "animate-none" : "",
						)}
					></div>
				) : null}

				<div className="w-full h-full">
					{player.hero ? <HeroComponent hero={player.hero} /> : null}
				</div>

				<div>
					{player.history.length <= 1 ? null : (
						<button
							type="button"
							title="Open life history"
							onClick={openLifeHistory}
							className="absolute bottom-0 right-0 z-30 m-4 bg-primary p-2 rounded-xl font-medium cursor-pointer text-left"
						>
							{player.history
								.map((life, i, arr) => {
									if (!arr[i + 1]) return null;

									const delta = life.value - arr[i + 1].value;

									return (
										<div
											className={cn(
												[
													"opacity-100",
													"opacity-80",
													"opacity-60",
												][i],
												i === 0 ? "underline" : "",
												delta > 0
													? "text-green-800"
													: "text-red-800",
											)}
											key={life.time}
										>
											{delta > 0 ? "+" : "- "}
											{Math.abs(delta)}
										</div>
									);
								})
								.slice(0, 3)
								.reverse()}
						</button>
					)}
				</div>

				<div
					className={cn(
						"z-10 h-full w-full flex justify-center items-center flex-col text-white absolute top-0 bg-black/60",
						life === 0 ? "text-red-500" : "",
					)}
				>
					<p className="text-2xl rotate-180">{life}</p>
					<p className="text-9xl">{life}</p>

					<span
						className={cn(
							"text-4xl",
							life - player.currentLife === 0 ? "opacity-0" : "",
							life - player.currentLife < 0
								? "text-red-500"
								: "text-green-500",
						)}
					>
						{life - player.currentLife}
					</span>
				</div>

				<button
					type="button"
					className={cn(
						"z-20 absolute flex",
						!useVerticalButtons
							? "w-1/2 h-full top-0 items-center justify-start"
							: "w-full h-1/2 bottom-0 items-end justify-center",
					)}
					onTouchStart={(e) => touchStart(e, false)}
					onMouseDown={(e) => touchStart(e, false)}
					onTouchEnd={(e) => touchEnd(e, false)}
					onMouseUp={(e) => touchEnd(e, false)}
					onPointerLeave={touchCancel}
				>
					<ChevronDownIcon size={120} className="opacity-30" />
				</button>

				<button
					type="button"
					className={cn(
						"z-20 absolute flex",
						!useVerticalButtons
							? "top-0 right-0 w-1/2 h-full items-center justify-end"
							: "top-0 h-1/2 w-full items-start justify-center",
					)}
					onTouchStart={(e) => touchStart(e, true)}
					onMouseDown={(e) => touchStart(e, true)}
					onTouchEnd={(e) => touchEnd(e, true)}
					onMouseUp={(e) => touchEnd(e, true)}
					onPointerLeave={touchCancel}
				>
					<ChevronUpIcon size={120} className="opacity-30" />
				</button>
			</div>
		);
	},
);
