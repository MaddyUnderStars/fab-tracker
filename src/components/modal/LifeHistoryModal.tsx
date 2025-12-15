import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X as CloseIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Player } from "@/lib/player";

export const LifeHistoryModal = NiceModal.create(
	observer(({ player }: { player: Player }) => {
		const modal = useModal();

		return (
			<div className="z-50 absolute top-0 left-0 bg-background text-foreground w-full h-full">
				<div className="flex items-center justify-between bg-accent p-4 fixed w-full">
					<h1>Life History for {player.hero.name}</h1>
					<button type="button" onClick={() => modal.remove()}>
						<CloseIcon size={24} />
					</button>
				</div>

				<div className="mt-16 flex items-center flex-col">
					{player.history.map((life) => (
						<p key={life}>{life}</p>
					))}
				</div>
			</div>
		);
	}),
);
