import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useCards } from "@/hook/cardContext";
import { Player } from "@/lib/player";
import { settings } from "@/lib/settings";
import { HeroSelectComponent } from "../HeroList";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const SettingsComponent = NiceModal.create(
	observer(() => {
		const players = settings.players;
		const heroes = useCards().heroes;

		// Find the top 8 most played heroes
		// sorted by play count
		// and filtered by amount > 1
		// Use state for this so that the list doesn't sort while the user is adding heroes
		// TODO: this is a lot of loops, but I don't care right now
		const [favouriteHeroes] = useState(
			[...(settings.mostPlayed?.entries?.() || [])]
				.sort(([_, a], [__, b]) => b - a)
				.filter(([_, amount]) => amount > 1)
				.map(([card_id]) => heroes.find((y) => y.card_id === card_id))
				.slice(0, 8)
				.filter((x) => !!x),
		);

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

		const resetPlayers = () => {
			const heroes = settings.players.map((x) => x.hero);
			clearPlayers();

			for (const h of heroes) {
				settings.addPlayer(new Player(h));
			}
		};

		const clearPlayers = () => {
			for (const p of players) {
				settings.removePlayer(p.id);
			}
		};

		const modal = useModal();
		const closeModal = () => {
			modal.resolve(players);
			modal.remove();
		};

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
			<div className="z-40 absolute top-0 left-0 bg-background text-foreground w-full h-full">
				<div className="z-50 flex items-center justify-between bg-accent p-4 fixed w-full">
					<h1>Settings</h1>
					<Button
						variant="default"
						size="sm"
						type="button"
						onClick={() => closeModal()}
					>
						Finish
					</Button>
				</div>

				<div className="p-4 mt-15">
					<div className="flex items-center justify-between">
						<span>
							<h2 className="font-bold">Hero Select</h2>
							<p>Select up to 4 heroes</p>
						</span>

						<span className="flex gap-2">
							<Button
								onClick={() => resetPlayers()}
								variant="secondary"
								className="cursor-pointer"
							>
								Reset Life
							</Button>

							<Button
								onClick={() => clearPlayers()}
								variant="destructive"
								className="cursor-pointer"
							>
								Clear
							</Button>
						</span>
					</div>

					<div className="max-w-lg mt-2 mb-2">
						<Input
							type="text"
							placeholder="Search"
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<details open>
						<summary>
							<h2 className="cursor-pointer inline">
								Most Played
							</h2>
						</summary>

						<HeroSelectComponent
							heroes={favouriteHeroes || []}
							selected={players.map((x) => ({
								card_id: x.hero.card_id,
								id: x.id,
							}))}
							onClick={setPlayers}
						/>
					</details>

					<details open className="mt-2">
						<summary className="cursor-pointer">
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

					<details className="mt-2">
						<summary>
							<h2 className="inline cursor-pointer">
								Young Heroes
							</h2>
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

				<div className="p-4">
					<h2 className="mb-2 font-bold">App settings</h2>

					<div className="flex items-center gap-3">
						<Checkbox
							defaultChecked={settings.verticalButtons}
							id="verticalButtons"
							onCheckedChange={(checked) => {
								settings.verticalButtons = checked === true;
							}}
						/>
						<Label htmlFor="verticalButtons">
							Use vertical life buttons
						</Label>
					</div>
				</div>
			</div>
		);
	}),
);
