import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X as CloseIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { settings } from "@/lib/settings";

export const LifeHistoryModal = NiceModal.create(
	observer(() => {
		const players = settings.players;
		const modal = useModal();

		const mergedHistory = players
			.flatMap((x) =>
				x.history.slice(0, -1).map((y) => ({ ...y, player: x.id })),
			)
			.sort((a, b) => a.time - b.time);

		return (
			<div className="z-50 absolute top-0 left-0 bg-background text-foreground w-full h-full">
				<div className="flex items-center justify-between bg-secondary p-4 fixed w-full">
					<h1>Life History</h1>
					<button type="button" onClick={() => modal.remove()}>
						<CloseIcon size={24} />
					</button>
				</div>

				<table className="mt-16 w-full table-fixed text-center">
					<thead>
						<tr>
							{players.map((player) => (
								<th scope="col" key={player.id}>
									{player.hero.name}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="[&>tr]:even:bg-accent/25">
						<tr>
							{players.map((x) => (
								<td key={x.id}>{x.hero.health}</td>
							))}
						</tr>

						{mergedHistory.map((entry) => {
							const playerIndex = players.findIndex(
								(x) => x.id === entry.player,
							);

							const player = players[playerIndex];

							const prev =
								player.history[
									player.history.findIndex(
										(x) => x.time === entry.time,
									) + 1
								];
							const delta = prev ? entry.value - prev.value : 0;

							return (
								<tr key={entry.time}>
									{new Array(playerIndex)
										.fill(0)
										.map((_, i) => (
											<td key={`${entry.time}${i}`}></td>
										))}

									<td>
										{entry.value} (
										<span
											className={
												delta > 0
													? "text-green-500"
													: "text-red-500"
											}
										>
											{delta > 0 ? "+" : "-"}
											{Math.abs(delta)}
										</span>
										)
									</td>

									{new Array(players.length - playerIndex - 1)
										.fill(0)
										.map((_, i) => (
											<td key={`${entry.time}${i}`}></td>
										))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}),
);
