import type { Card } from "@/lib/cards";

export const HeroComponent = ({ hero }: { hero: Card }) => {
	return (
		<div className="w-full h-full overflow-hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 435 340"
				className="w-full h-full overflow-hidden"
				preserveAspectRatio="xMidYMid slice"
			>
				<title>{hero.name}</title>
				<image href={hero.image.large} x={-60} y={-97} />
			</svg>
		</div>
	);
};
