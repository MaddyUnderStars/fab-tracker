import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import NiceModal from "@ebay/nice-modal-react";
import App from "./App.tsx";
import { LoadingComponent } from "./components/Loading.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { CardContext } from "./hook/cardContext.ts";
import { cacheGetHeroes } from "./lib/cards.ts";

const HEROES = cacheGetHeroes();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<CardContext value={{ heroes: HEROES }}>
				<Suspense fallback={<LoadingComponent />}>
					<NiceModal.Provider>
						<App />
					</NiceModal.Provider>
				</Suspense>
			</CardContext>
		</ThemeProvider>
	</StrictMode>,
);
