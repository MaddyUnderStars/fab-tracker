import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useCards } from "@/hook/cardContext";
import { Player } from "@/lib/player";
import { settings } from "@/lib/settings";
import { HeroSelectComponent } from "../HeroList";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const SettingsComponent = NiceModal.create(
	observer(() => {
		const players = settings.players;

		const setPlayers = (selected: { card_id: string; id?: string }[]) => {
			const removed = players.filter(
				(x) => !selected.find((y) => y.id === x.id),
			);
			const added = selected.filter(
				(x) => !players.find((y) => y.id === x.id),
			);

			for (const r of removed) settings.removePlayer(r.id);
			for (const a of added) {
				const hero = heroes.find((x) => x.card_id === a.card_id);
				if (!hero) continue;

				settings.addPlayer(new Player(hero));
			}
		};

		const modal = useModal();
		const closeModal = () => {
			modal.resolve(players);
			modal.remove();
		};

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
					<Button
						size="sm"
						type="button"
						onClick={() => closeModal()}
					>
						Finish
					</Button>
				</div>

				<div className="p-4 mt-15">
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

						<HeroSelectComponent
							heroes={adultHeroes}
							selected={players.map((x) => ({
								card_id: x.hero.card_id,
								id: x.id,
							}))}
							onClick={setPlayers}
						/>
					</details>

					<details>
						<summary>
							<h2 className="inline">Young Heroes</h2>
						</summary>

						<HeroSelectComponent
							heroes={youngHeroes}
							selected={players.map((x) => ({
								card_id: x.hero.card_id,
								id: x.id,
							}))}
							onClick={setPlayers}
						/>
					</details>
				</div>
			</div>
		);
	}),
);
