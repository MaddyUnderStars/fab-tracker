import NiceModal from "@ebay/nice-modal-react";
import { History } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import type { Player } from "@/lib/player";
import { cn } from "@/lib/utils";
import { HeroComponent } from "./Hero";
import { Button } from "./ui/button";

export const PlayerComponent = observer(
	({ upsideDown, player }: { upsideDown?: boolean; player: Player }) => {
		const longPressActivated = useRef(false);
		const timerRef = useRef<number>(0);

		const [life, setLife] = useState(player.currentLife);
		const lifeRef = useRef(player.currentLife);

		const lifeModifyTimer = useRef<number>(0);

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
					navigator.vibrate(10);
				}

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
			}

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
				<div className="w-full h-full">
					{player.hero ? <HeroComponent hero={player.hero} /> : null}
				</div>

				<div>
					<Button
						className="absolute bottom-0 right-0 z-30 m-4"
						onClick={openLifeHistory}
					>
						<History />
					</Button>
				</div>

				<div className="z-10 h-full w-full flex justify-center items-center flex-col text-white absolute top-0 bg-black/75">
					<p className="text-2xl rotate-180">{life}</p>
					<p className="text-9xl">{life}</p>
				</div>

				<button
					type="button"
					className="z-20 w-1/2 h-full absolute top-0"
					onTouchStart={(e) => touchStart(e, false)}
					onMouseDown={(e) => touchStart(e, false)}
					onTouchEnd={(e) => touchEnd(e, false)}
					onMouseUp={(e) => touchEnd(e, false)}
				></button>

				<button
					type="button"
					className="z-20 top-0 right-0 absolute w-2/4 h-full"
					onTouchStart={(e) => touchStart(e, true)}
					onMouseDown={(e) => touchStart(e, true)}
					onTouchEnd={(e) => touchEnd(e, true)}
					onMouseUp={(e) => touchEnd(e, true)}
				></button>
			</div>
		);
	},
);
