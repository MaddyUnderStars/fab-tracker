import { useState } from "react";
import type { Card } from "@/lib/cards";
import { cn } from "@/lib/utils";
import { HeroComponent } from "./Hero";

export const HeroListComponent = ({
	heroes,
	onClick,
	selected,
}: {
	heroes: Card[];
	onClick: (selected: Card[]) => void;
	selected?: Card[];
}) => {
	const [selectedHeroes, setSelectedHeroes] = useState(
		selected?.map((x) => x.card_id),
	);

	const selectHero = (x: Card) => {
		const ret = new Set([...(selectedHeroes || []), x.card_id]);

		if (ret.size > 4) return;

		if (selectedHeroes?.includes(x.card_id)) {
			ret.delete(x.card_id);
		}

		setSelectedHeroes([...ret]);
		onClick(heroes.filter((x) => ret.has(x.card_id)));
	};

	return (
		<div className="grid gap-1 grid-cols-4 lg:grid-cols-8 text-center">
			{heroes.map((currHero) => (
				<button
					key={currHero.card_id}
					type="button"
					onClick={() => selectHero(currHero)}
					className={cn(
						"p-1 cursor-pointer border-2",
						selectedHeroes?.includes(currHero.card_id)
							? "border-accent-foreground"
							: "",
					)}
				>
					<div>
						<HeroComponent hero={currHero} />
					</div>

					<span>
						<div className="truncate">{currHero.name}</div>
					</span>
				</button>
			))}
		</div>
	);
};
