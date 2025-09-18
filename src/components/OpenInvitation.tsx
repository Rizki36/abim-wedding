import leafTopRight from "../assets/1/1. DAUN_ATAS KANAN.webp";
import leafTopLeft from "../assets/1/1. DAUN_ATAS KIRI.webp";
import leafBottomRight from "../assets/1/1. DAUN_BAWAH KANAN.webp";
import leafBottomLeft from "../assets/1/1. DAUN_BAWAH KIRI.webp";

type Props = {
	name?: string;
	event?: string;
	couple?: string;
	onOpen: () => void;
};

export default function OpenInvitation({
	name = "Tamu",
	event = "Akad & Resepsi",
	couple = "Erica & Abi",
	onOpen,
}: Props) {
	return (
		<dialog className="invite-overlay" open aria-label="Buka undangan">
			{/* Botanicals corners reuse */}
			<img src={leafTopRight} alt="" className="loader-leaf top right" />
			<img src={leafTopLeft} alt="" className="loader-leaf top left" />
			<img src={leafBottomRight} alt="" className="loader-leaf bottom right" />
			<img src={leafBottomLeft} alt="" className="loader-leaf bottom left" />

			<div className="invite-card">
				<div className="invite-content">
					<p className="invite-heading">The Wedding</p>
					<p className="invite-couple">{couple}</p>
					<p className="invite-sub">Kepada Yth.</p>
					<p className="invite-name">{name}</p>
					<p className="invite-event">Undangan {event}</p>
					<button
						type="button"
						className="invite-button"
						onClick={onOpen}
						aria-label="Buka undangan"
					>
						Buka Undangan
					</button>
					<p className="invite-note">
						Sentuh tombol untuk membuka dan memulai musik
					</p>
				</div>
			</div>
		</dialog>
	);
}
