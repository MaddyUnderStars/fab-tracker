import { XIcon } from "lucide-react";
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
		const ret = [...(selectedHeroes || [])];

		// if (
		// selectedHeroes?.filter((y) => y.card_id === x.card_id).length === 1
		// ) {
		// ret = ret.filter((y) => y.card_id !== x.card_id);
		// } else {
		ret.push({ card_id: x.card_id });
		// }

		if (ret.length > 4) return;

		setSelectedHeroes(ret);
		onClick(ret);
	};

	const removeHero = (card_id: string) => {
		const ret = [...(selectedHeroes || [])];

		ret.splice(
			ret.findIndex((x) => x.card_id === card_id),
			1,
		);

		setSelectedHeroes(ret);
		onClick(ret);
	};

	return (
		<div className="grid gap-1 grid-cols-4 lg:grid-cols-8 text-center relative">
			{heroes.map((currHero) => {
				const duplicates =
					selectedHeroes?.filter(
						(x) => x.card_id === currHero.card_id,
					) || [];

				return (
					<div
						key={currHero.card_id}
						className={cn(
							"p-1 cursor-pointer border-2 relative",
							selectedHeroes?.find(
								(x) => x.card_id === currHero.card_id,
							)
								? "border-accent-foreground"
								: "",
						)}
					>
						{duplicates.length > 1 ? (
							<span className="flex items-start justify-start absolute ps-1 top-0 left-0 z-10 bg-white text-black size-6 rounded-br-2xl">
								{duplicates.length}
							</span>
						) : null}

						{duplicates.length > 0 ? (
							<button
								type="button"
								onClick={() => removeHero(currHero.card_id)}
								className="flex items-start justify-end absolute top-0 right-0 z-10 bg-white size-6 rounded-bl-2xl text-red-800"
							>
								<XIcon size={20} />
							</button>
						) : null}

						<button
							type="button"
							onClick={() => selectHero(currHero)}
						>
							<HeroComponent hero={currHero} />
						</button>

						<button
							type="button"
							onClick={() => selectHero(currHero)}
							className="w-full truncate"
						>
							<span>{currHero.name}</span>
						</button>
					</div>
				);
			})}
		</div>
	);
};
