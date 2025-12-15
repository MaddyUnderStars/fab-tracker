import { makeAutoObservable } from "mobx";
import type { Card } from "./cards";

export class Player {
	private _id: string;

	private _hero: Card;

	// life[0] is current life, incrementing goes further into past
	private life: number[];

	constructor(hero: Card) {
		this._id = `${Math.random()}`.split(".")[1];
		this._hero = hero;
		this.life = [Number.parseInt(this.hero.life, 10)];

		makeAutoObservable(this);
	}

	public get id() {
		return this._id;
	}

	public get currentLife() {
		return this.life[0];
	}

	public set currentLife(value: number) {
		if (this.life[0] !== value) this.life.unshift(value);
	}

	public get history() {
		return this.life;
	}

	public get hero() {
		return this._hero;
	}
}
