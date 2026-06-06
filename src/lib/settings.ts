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

	/** tracks the latest version changelog seen */
	public seenChangelog: string = import.meta.env.VITE_APP_VERSION;

	constructor() {
		makeAutoObservable(this);

		makePersistable(this, {
			name: "SettingsStore",
			properties: [
				//@ts-expect-error
				"_mostPlayed",
				"verticalButtons",
				"vibrateAll",
				"seenChangelog",
			],
			storage: window.localStorage,
		});
	}

	public get mostPlayed() {
		return this._mostPlayed;
	}

	public addPlayer = (player: Player) => {
		const card = player.hero.unique_id;
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
