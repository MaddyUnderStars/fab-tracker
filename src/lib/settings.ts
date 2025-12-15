import { makeAutoObservable } from "mobx";
import type { Player } from "./player";

class Settings {
	private _players: Player[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	public addPlayer = (player: Player) => {
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
