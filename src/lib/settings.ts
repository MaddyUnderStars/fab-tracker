import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import type { Player } from "./player";

class Settings {
	private _players: Player[] = [];

	// card id array of most played heroes
	private _mostPlayed: Map<string, number> = new Map();

	// whether to use vertical life buttons instead of horizontal
	public verticalButtons: boolean = false;

	// whether to vibrate for all touch
	// or only long press
	public vibrateAll: boolean = true;

	constructor() {
		makeAutoObservable(this);

		makePersistable(this, {
			name: "SettingsStore",
			//@ts-expect-error
			properties: ["_mostPlayed", "verticalButtons", "vibrateAll"],
			storage: window.localStorage,
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
