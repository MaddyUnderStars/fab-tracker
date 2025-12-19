import { autorun, makeAutoObservable, set, toJS } from "mobx";
import type { Player } from "./player";

class Settings {
	private _players: Player[] = [];

	// card id array of most played heroes
	private _mostPlayed: Map<string, number> = new Map();

	constructor() {
		makeAutoObservable(this);

		const stored = window.localStorage.getItem("mostPlayed");
		if (stored) {
			set(this, { _mostPlayed: new Map(JSON.parse(stored)) });
		}

		autorun(() => {
			const value = toJS(this);
			window.localStorage.setItem(
				"mostPlayed",
				JSON.stringify([...value._mostPlayed.entries()]),
			);
		});
	}

	public get mostPlayed() {
		return this._mostPlayed;
	}

	public addPlayer = (player: Player) => {
		const card = player.hero.card_id;
		this._mostPlayed.set(card, (this._mostPlayed.get(card) ?? 0) + 1);
		this._players.push(player);
	};

	public removePlayer = (id: string) => {
		this._players = this._players.filter((x) => x.id !== id);
	};

	public get players() {
		return this._players;
	}
}

export const settings = new Settings();
