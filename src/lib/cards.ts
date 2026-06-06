const CARDS_URL =
	"https://raw.githubusercontent.com/the-fab-cube/flesh-and-blood-cards/refs/heads/develop/json/english/card.json";

export type Card = {
	unique_id: string;
	name: string;
	health: string;
	types: string[];

	blitz_legal: boolean;
	cc_legal: boolean;
	commoner_legal: boolean;
	ll_legal: boolean;
	silver_age_legal: boolean;
	blitz_living_legend: boolean;
	cc_living_legend: boolean;
	blitz_banned: boolean;
	cc_banned: boolean;
	commoner_banned: boolean;
	ll_banned: boolean;
	silver_age_banned: boolean;
	upf_banned: boolean;
	blitz_suspended: boolean;
	cc_suspended: boolean;
	commoner_suspended: boolean;
	ll_restricted: boolean;

	printings: CardPrinting[];
};

type CardPrinting = {
	unique_id: string;
	id: string;

	image_url: string;
};

export const getHeroes = async (): Promise<Card[]> => {
	const res = await fetch(CARDS_URL);
	const json = (await res.json()) as Card[];

	const heroes = json.filter((x) => x.types.includes("Hero"));

	return heroes;
};

type HeroesCache = {
	exp: number;
	heroes: Card[];
};

const CACHE_TIME = 1000 * 60 * 60 * 24;
export const cacheGetHeroes = async (): Promise<Card[]> => {
	const cache = getStorage<HeroesCache>("heroes");

	if (!cache) {
		const item = await getHeroes();
		setStorage("heroes", {
			exp: Date.now(),
			heroes: item,
		});

		return item;
	}

	if (cache.exp - CACHE_TIME > Date.now() && navigator.onLine) {
		setStorage("heroes", null);
		return cacheGetHeroes();
	}

	return cache.heroes;
};

const getStorage = <T>(key: string): T | null => {
	try {
		const item = window.localStorage.getItem(key);
		if (!item) return null;

		return JSON.parse(item);
	} catch (e) {
		return null;
	}
};

const setStorage = <T>(key: string, value: T): T => {
	window.localStorage.setItem(key, JSON.stringify(value));
	return value;
};
