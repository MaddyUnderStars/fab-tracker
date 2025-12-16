import { useEffect, useState } from "react";

export const useScreenSize = () => {
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);

	useEffect(() => {
		const cb = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		window.addEventListener("resize", cb);

		return () => {
			window.removeEventListener("resize", cb);
		};
	});

	return {
		width,
		height,
	};
};
