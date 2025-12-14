import { type MouseEvent, type TouchEvent, useRef, useState } from "react";
import type { Card } from "@/lib/cards";
import { cn } from "@/lib/utils";
import { HeroComponent } from "./Hero";

export const PlayerComponent = ({
	upsideDown,
	hero,
}: {
	upsideDown?: boolean;
	hero: Card;
}) => {
	const [life, setLife] = useState(Number.parseInt(hero?.life ?? "40", 10));

	const timerRef = useRef<number>(0);
	const timerTriggeredRef = useRef<boolean>(false);
	const touchStart = (e: TouchEvent | MouseEvent, increase: boolean) => {
		e.preventDefault();

		// timerRef.current = Date.now();

		const doLongPress = () => {
			setLife((x) => x + (increase ? 1 : -1) * 5);
			timerTriggeredRef.current = true;

			if ("vibrate" in navigator) {
				navigator.vibrate(10);
			}

			timerRef.current = setTimeout(doLongPress, 300);
		};

		timerRef.current = setTimeout(doLongPress, 300);
	};

	const touchEnd = (e: TouchEvent | MouseEvent, increase: boolean) => {
		e.preventDefault();

		if (!timerTriggeredRef.current) {
			setLife((x) => x + (increase ? 1 : -1));
		}

		timerTriggeredRef.current = false;
		clearTimeout(timerRef.current);
	};

	return (
		<div
			className={cn(
				"relative w-full h-full select-none",
				upsideDown ? "rotate-180" : "",
			)}
		>
			<div className="w-full h-full">
				{hero ? <HeroComponent hero={hero} /> : null}
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

			<div className="z-10 h-full w-full flex justify-center items-center flex-col text-white absolute top-0 bg-black/75">
				<p className="text-2xl rotate-180">{life}</p>
				<p className="text-9xl">{life}</p>
			</div>
		</div>
	);
};
