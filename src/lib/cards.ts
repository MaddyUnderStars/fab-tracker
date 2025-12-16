const BASE_URL = new URL("https://cards.fabtcg.com");
const PAGE_SIZE = 100;

export type Card = {
	card_id: string;
	card_type: "regular";
	display_name: string;
	name: string;
	pitch: string;
	cost: string;
	defense: string;
	life: string;
	intellect: string;
	power: string;
	object_type: string;
	text: string;
	text_html: string;
	typebox: string;
	url: string;
	image: {
		small: string;
		normal: string;
		large: string;
	};
	back_face: null;
};

type PagedResults<TResult> = {
	count: number;
	next: string;
	previous: string;
	results: TResult[];
};

export type CardType = "Hero";

export type SearchQuery = {
	type: CardType[];
};

type SearchResult<TResult> = {
	results: TResult[];
	page: number;
	total_pages: number;
};

export const searchCards = async (
	query: SearchQuery,
	page = 0,
): Promise<SearchResult<Card>> => {
	const endpoint = new URL("/api/search/v1/cards", BASE_URL);
	endpoint.searchParams.set("limit", `${PAGE_SIZE}`);
	endpoint.searchParams.set("offset", `${PAGE_SIZE * page}`);

	for (const type of new Set(query.type))
		endpoint.searchParams.append("type", type);

	try {
		const res = await fetch(endpoint);

		const json = (await res.json()) as PagedResults<Card>;

		return {
			page,
			total_pages: Math.ceil(json.count / PAGE_SIZE),
			results: json.results,
		};
	} catch (e) {
		return {
			page,
			total_pages: 0,
			results: [],
		};
	}
};

export const getHeroes = async (): Promise<Card[]> => {
	console.log("miss");

	const out: Card[] = [];

	let page = 0;
	let pageResult: SearchResult<Card>;
	do {
		pageResult = await searchCards({ type: ["Hero"] }, page++);

		out.push(...pageResult.results);
	} while (pageResult.total_pages >= pageResult.page);

	return out;
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

	if (cache.exp - CACHE_TIME > Date.now()) {
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
