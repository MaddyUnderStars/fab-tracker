import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["health.png"],
			manifest: {
				name: "FaB Life Tracker",
				short_name: "Life Tracker",
				description: "Flesh and Blood Life Tracker",
				theme_color: "#94BA4B",
				icons: [
					{
						src: "192.png",
						sizes: "192x192",
						type: "image/png",
					},
				],
				display: "fullscreen",
				background_color: "#020618",
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern:
							/https:\/\/d2wlb52bya4y8z\.cloudfront\.net\/media\/cards\/large\/.*?.webp/i,
						handler: "CacheFirst",
						options: {
							cacheName: "ArtCache",
							expiration: {
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
