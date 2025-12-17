export default {
	"*.{ts,js,md,tsx,jsx}": [
		"npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off",
		() => "npm run build",
	],
};
