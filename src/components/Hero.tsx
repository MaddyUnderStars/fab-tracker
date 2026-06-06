import { useEffect, useState } from "react";
import type { Card } from "@/lib/cards";

export const HeroComponent = ({ hero }: { hero: Card }) => {
	const [useSvg, setUseSvg] = useState(!import.meta.env.VITE_PROXY_URL);

	// these default values are the ones that the official fab db uses
	// however, some of the images in the fab cube list use the tcgplayer images
	// which are much higher res
	const [imageWidth, setWidth] = useState(546);
	const [imageHeight, setHeight] = useState(762);

	const printing = hero.printings.find((x) => x.image_url);

	useEffect(() => {
		if (!printing) return;

		(async () => {
			const img = await loadImage(printing.image_url);

			setWidth(img.naturalWidth);
			setHeight(img.naturalHeight);
		})();
	}, [printing]);

	// these pixel values are the borders of the cards from the fab card db
	// since the images are different sizes, calculate the real borders pixel counts as a percentage
	const left = imageWidth * (60 / 546);
	const top = imageHeight * (97 / 762);

	const right = imageWidth * (111 / 546);
	const bottom = imageHeight * (422 / 762);

	return (
		<div className="w-full h-full overflow-hidden">
			{!useSvg ? (
				<img
					loading="lazy"
					crossOrigin="anonymous"
					className="w-full h-full object-cover"
					src={`${import.meta.env.VITE_PROXY_URL}/${printing?.id}`}
					alt={hero.name}
					onError={() => setUseSvg(true)}
				/>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox={`0 0 ${imageWidth - right} ${imageHeight - bottom}`}
					className="w-full h-full overflow-hidden"
					preserveAspectRatio="xMidYMid slice"
				>
					<title>{hero.name}</title>
					<image href={printing?.image_url} x={-left} y={-top} />
				</svg>
			)}
		</div>
	);
};

const loadImage = (url: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = url;
	});
