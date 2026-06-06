import { makeAutoObservable } from "mobx";
import type { Card } from "./cards";

export class Player {
	private _id: string;

	private _hero: Card;

	// life[0] is current life, incrementing goes further into past
	private life: { value: number; time: number }[];

	constructor(hero: Card) {
		this._id = `${Math.random()}`.split(".")[1];
		this._hero = hero;
		this.life = [
			{ value: Number.parseInt(this.hero.health, 10), time: Date.now() },
		];

		makeAutoObservable(this);
	}

	public reset() {
		this.life = [
			{
				value: Number.parseInt(this._hero.health, 10),
				time: Date.now(),
			},
		];
		return this.life[0];
	}

	public get id() {
		return this._id;
	}

	public get currentLife() {
		return this.life[0].value;
	}

	public set currentLife(value: number) {
		if (this.life[0].value !== value)
			this.life.unshift({ value, time: Date.now() });
	}

	public get history() {
		return this.life;
	}

	public get hero() {
		return this._hero;
	}
}
