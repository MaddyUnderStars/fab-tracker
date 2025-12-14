import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X } from "lucide-react";
import { useState } from "react";
import { useCards } from "@/hook/cardContext";
import type { Card } from "@/lib/cards";
import { HeroListComponent } from "../HeroList";
import { Input } from "../ui/input";

export const SettingsComponent = NiceModal.create(
	({ players: defaultPlayers }: { players: Card[] }) => {
		const modal = useModal();
		const closeModal = () => {
			modal.resolve(players);
			modal.remove();
		};

		const [players, setPlayers] = useState<Card[]>(defaultPlayers);

		const heroes = useCards().heroes;

		const [query, setQuery] = useState<string>("");

		const filteredHeroes = heroes.filter((x) =>
			x.name.toLowerCase().includes(query.toLowerCase()),
		);
		const youngHeroes = filteredHeroes.filter(
			(x) => Number.parseInt(x.life, 10) < 25,
		);
		const adultHeroes = filteredHeroes.filter(
			(x) => Number.parseInt(x.life, 10) > 25,
		);

		return (
			<div className="z-50 absolute top-0 left-0 bg-background text-foreground w-full h-full">
				<div className="flex items-center justify-between bg-accent p-4 fixed w-full">
					<h1>Settings</h1>
					<button type="button" onClick={() => closeModal()}>
						<X size={24} />
					</button>
				</div>

				<div className="p-4 mt-12">
					<h2 className="font-bold">Hero Select</h2>
					<p>Select up to 4 heroes</p>

					<div className="max-w-lg mt-2 mb-2">
						<Input
							type="text"
							placeholder="Search"
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<details open>
						<summary>
							<h2 className="inline">Adult Heroes</h2>
						</summary>

						<HeroListComponent
							heroes={adultHeroes}
							selected={players}
							onClick={setPlayers}
						/>
					</details>

					<details>
						<summary>
							<h2 className="inline">Young Heroes</h2>
						</summary>

						<HeroListComponent
							heroes={youngHeroes}
							selected={players}
							onClick={setPlayers}
						/>
					</details>
				</div>
			</div>
		);
	},
);
