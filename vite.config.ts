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
				theme_color: "#020618",
				icons: [
					{
						src: "192.png",
						sizes: "192x192",
						type: "image/png",
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
