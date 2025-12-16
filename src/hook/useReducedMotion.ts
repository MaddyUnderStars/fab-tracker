import { useEffect, useState } from "react";

export const useReducedMotion = () => {
	const [isPreferred, setIsPreferred] = useState<boolean | undefined>(
		undefined,
	);

	useEffect(() => {
		const mql = window.matchMedia(`(prefers-reduced-motion: reduce)`);

		const get = () => {
			const mql = window.matchMedia(`(prefers-reduced-motion: reduce)`);
			return mql.matches === true;
		};

		const onChange = () => {
			setIsPreferred(get());
		};

		mql.addEventListener("change", onChange);
		setIsPreferred(mql.matches === true);

		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isPreferred;
};
