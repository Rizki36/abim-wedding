import { useEffect, useState } from "react";

// Reuse existing decorative assets to match the theme
import leafTopRight from "../assets/1/1. DAUN_ATAS KANAN.webp";
import leafTopLeft from "../assets/1/1. DAUN_ATAS KIRI.webp";
import leafBottomRight from "../assets/1/1. DAUN_BAWAH KANAN.webp";
import leafBottomLeft from "../assets/1/1. DAUN_BAWAH KIRI.webp";

type Props = {
	progress: number; // 0–100
	done?: boolean; // fade out when true
};

export default function ThemedLoader({ progress, done }: Props) {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (done) {
			const t = setTimeout(() => setHidden(true), 500);
			return () => clearTimeout(t);
		}
	}, [done]);

	if (hidden) return null;

	return (
		<div
			className={`loader-overlay ${done ? "fade-out" : ""}`}
			// biome-ignore lint/a11y/useSemanticElements: <explanation>
			role="status"
			aria-live="polite"
			aria-label={`Memuat aset ${progress}%`}
		>
			{/* Corner botanicals */}
			<img src={leafTopRight} alt="" className="loader-leaf top right" />
			<img src={leafTopLeft} alt="" className="loader-leaf top left" />
			<img src={leafBottomRight} alt="" className="loader-leaf bottom right" />
			<img src={leafBottomLeft} alt="" className="loader-leaf bottom left" />

			{/* Center card with stamp */}
			<div className="loader-card">
				<div className="loader-content">
					<p className="loader-title">The Wedding</p>
					<div className="loader-progress" aria-hidden>
						<div
							className="loader-bar"
							style={{ width: `${Math.max(5, progress)}%` }}
						/>
					</div>
					<div className="loader-percent">
						{Math.min(100, Math.max(0, Math.round(progress)))}%
					</div>
					<span className="loader-sub">Memuat undangan…</span>
				</div>
			</div>
		</div>
	);
}
