import NiceModal from "@ebay/nice-modal-react";
import { Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
import { LifeHistoryModal } from "./components/modal/LifeHistoryModal";
import { SettingsComponent } from "./components/modal/SettingsModal";
import { PlayerComponent } from "./components/Player";
import { Button } from "./components/ui/button";
import { useScreenSize } from "./hook/useScreenSize";
import type { Card } from "./lib/cards";
import { settings } from "./lib/settings";
import { cn } from "./lib/utils";

NiceModal.register("settings", SettingsComponent);
NiceModal.register("lifeHistory", LifeHistoryModal);

const App = observer(() => {
	const players = settings.players;
	const gridTemplate = useGridTemplate(players.length);

	const openSettings = async () => {
		NiceModal.show<Card[]>("settings");
	};

	if (!players.length) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center">
				<h1 className="text-2xl">Flesh and Blood Life Tracker</h1>
				<Button type="button" onClick={openSettings}>
					<Settings size={"2rem"} />
					<p>Open settings</p>
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full h-full">
			<div
				className={cn(
					"z-30 pointer-events-none w-full h-full absolute flex",
					players.length >= 2
						? "items-center justify-center"
						: "justify-end",
				)}
			>
				<Button
					className="m-4 pointer-events-auto cursor-pointer"
					type="button"
					onClick={openSettings}
				>
					<Settings size={"2rem"} />
				</Button>
			</div>

			<div
				className={cn("grid h-full w-full gap-2")}
				style={gridTemplate}
			>
				{players
					.slice()
					.reverse()
					.map((player, i) => (
						<PlayerComponent
							key={player.id}
							player={player}
							upsideDown={orientations[players.length][i]}
						/>
					))}
			</div>
		</div>
	);
});

export default App;

// kind of bad, but whatever
const orientations = [
	[],
	[false],
	[true, false],
	[true, true, false],
	[true, true, false, false],
];

const useGridTemplate = (playerCount: number) => {
	const { width, height } = useScreenSize();

	const grid = {
		rows: 1,
		cols: 1,
	};

	if (playerCount >= 2) {
		grid.rows = 2;
	}

	if (playerCount >= 3) {
		grid.cols = 2;
	}

	if (width > height) {
		const temp = grid.rows;
		grid.rows = grid.cols;
		grid.cols = temp;
	}

	return {
		gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
		gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
	};
};
