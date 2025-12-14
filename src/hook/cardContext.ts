import { createContext, use, useContext } from "react";
import type { Card } from "@/lib/cards";

export const CardContext = createContext<{ heroes: Promise<Card[]> }>({
	heroes: Promise.resolve([]),
});

export const useCards = () => {
	const ctx = useContext(CardContext);

	const heroes = use(ctx.heroes);

	return {
		heroes,
	};
};
