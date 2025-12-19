import { XIcon } from "lucide-react";
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
	const selectHero = (x: Card) => {
		const ret = [...(selected || [])];

		// if (
		// selectedHeroes?.filter((y) => y.card_id === x.card_id).length === 1
		// ) {
		// ret = ret.filter((y) => y.card_id !== x.card_id);
		// } else {
		ret.push({ card_id: x.card_id });
		// }

		if (ret.length > 4) return;

		onClick(ret);
	};

	const removeHero = (card_id: string) => {
		const ret = [...(selected || [])];

		ret.splice(
			ret.findIndex((x) => x.card_id === card_id),
			1,
		);

		onClick(ret);
	};

	return (
		<div className="grid gap-1 grid-cols-4 lg:grid-cols-8 text-center relative">
			{heroes.map((currHero) => {
				const duplicates =
					selected?.filter((x) => x.card_id === currHero.card_id) ||
					[];

				return (
					<div
						key={currHero.card_id}
						className={cn(
							"p-1 cursor-pointer border-2 relative",
							selected?.find(
								(x) => x.card_id === currHero.card_id,
							)
								? "border-accent-foreground"
								: "",
						)}
					>
						{duplicates.length > 1 ? (
							<span className="cursor-pointer flex items-center justify-center pe-2 pb-1 absolute ps-1 top-0 left-0 z-10 bg-white text-black size-8 rounded-br-2xl">
								{duplicates.length}
							</span>
						) : null}

						{duplicates.length > 0 ? (
							<button
								type="button"
								onClick={() => removeHero(currHero.card_id)}
								className="cursor-pointer flex items-center justify-center ps-1 pb-1 absolute top-0 right-0 z-10 bg-white size-8 rounded-bl-2xl text-red-800"
							>
								<XIcon size={20} />
							</button>
						) : null}

						<button
							type="button"
							className="truncate w-full cursor-pointer"
							onClick={() => selectHero(currHero)}
						>
							<HeroComponent hero={currHero} />

							<span>{currHero.name}</span>
						</button>
					</div>
				);
			})}
		</div>
	);
};
