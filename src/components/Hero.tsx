import { useState } from "react";
import type { Card } from "@/lib/cards";

export const HeroComponent = ({ hero }: { hero: Card }) => {
	const [useSvg, setUseSvg] = useState(false);

	return (
		<div className="w-full h-full overflow-hidden">
			{!useSvg ? (
				<img
					loading="lazy"
					crossOrigin="anonymous"
					src={`${import.meta.env.VITE_PROXY_URL}/${hero.card_id}`}
					alt={hero.name}
					onError={() => setUseSvg(true)}
				/>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 435 340"
					className="w-full h-full overflow-hidden"
					preserveAspectRatio="xMidYMid slice"
				>
					<title>{hero.name}</title>
					<image href={hero.image.large} x={-60} y={-97} />
				</svg>
			)}
		</div>
	);
};
