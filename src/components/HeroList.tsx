import { useState } from "react";
import type { Card } from "@/lib/cards";
import { cn } from "@/lib/utils";
import { HeroComponent } from "./Hero";

type SelectedHero = {
	card_id: string;
	id?: string;
};

export const HeroSelectComponent = ({
	heroes,
	onClick,
	selected,
}: {
	heroes: Card[];
	onClick: (selected: SelectedHero[]) => void;
	selected?: SelectedHero[];
}) => {
	const [selectedHeroes, setSelectedHeroes] = useState(selected);

	const selectHero = (x: Card) => {
		let ret = [...(selectedHeroes || [])];

		if (selectedHeroes?.find((y) => y.card_id === x.card_id)) {
			ret = ret.filter((y) => y.card_id !== x.card_id);
		} else {
			ret.push({ card_id: x.card_id });
		}

		if (ret.length > 4) return;

		setSelectedHeroes(ret);
		onClick(ret);
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
						selectedHeroes?.find(
							(x) => x.card_id === currHero.card_id,
						)
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
