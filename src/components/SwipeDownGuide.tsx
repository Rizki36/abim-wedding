type Props = {
	visible: boolean;
	message?: string;
};

export default function SwipeDownGuide({ visible, message }: Props) {
	return (
		<div
			className={`swipe-guide ${visible ? "show" : "hide"}`}
			aria-hidden={!visible}
		>
			<div className="swipe-chip">
				<span className="swipe-text">{message ?? "Geser ke bawah"}</span>
				<span className="swipe-icon" aria-hidden />
			</div>
		</div>
	);
}
