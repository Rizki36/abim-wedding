import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import backsoundUrl from "./assets/backsound.mp3";

// Page 1 assets
import page1_1_1 from "./assets/1/1. DAUN_ATAS KANAN.webp";
import page1_1_2 from "./assets/1/1. DAUN_ATAS KIRI.webp";
import page1_1_3 from "./assets/1/1. DAUN_BAWAH KANAN.webp";
import page1_1_4 from "./assets/1/1. DAUN_BAWAH KIRI.webp";
import page1_3 from "./assets/1/3. STAMP_1.webp";
import page1_4 from "./assets/1/4. 26_1.webp";
import page1_5 from "./assets/1/5. NAMA_1.webp";
import page1_6 from "./assets/1/6. ART_1.webp";

// Page 2 assets
import page2_0 from "./assets/2/0. ASS_2.webp";
import page2_2 from "./assets/2/2. ART_2.webp";
import page2_3_1 from "./assets/2/3. IBU 1_2.webp";
import page2_3_2 from "./assets/2/3. IBU 2_2.webp";
import page2_4_1 from "./assets/2/4. AYAH 1_3.webp";
import page2_4_2 from "./assets/2/4. AYAH 2_3.webp";
import page2_5 from "./assets/2/5. BG CONTXT_2.webp";

// Page 3 assets
import page3_1 from "./assets/3/1. WAKTU DAN TEMPAT_3.webp";
import page3_2_1 from "./assets/3/2. DAUN_BAWAH KANAN_3.webp";
import page3_2_2 from "./assets/3/2. DAUN_BAWAH KIRI_3.webp";
import page3_3_1 from "./assets/3/3. ART_ABI_3.webp";
import page3_3_2 from "./assets/3/3. ART_ERICA_3.webp";
import page3_4_1 from "./assets/3/4. TSAH_1_3.webp";
import page3_4_2 from "./assets/3/4. TSAH_2_3.webp";
import page3_5 from "./assets/3_rumah/5. HANDSHAKE_3 RUMAH.gif";
import page3_6 from "./assets/3/6. RESEPSI NIKAH_3.webp";
import page3_7 from "./assets/3/7. TEMU JAWA_3.webp";
import page3_8 from "./assets/3/8. AKAD_3.webp";
import page3_9 from "./assets/3/9. LOC_3.webp";
import page3_10 from "./assets/3/10. COLOR_3.webp";
import page3_11 from "./assets/3/11. DATE_3.webp";
import page3_12 from "./assets/3/12. DATE BG_3.webp";

// Page 4 assets
import page4_1 from "./assets/4/1. DAUN_4.webp";
// import page4_2_1 from "./assets/4/2. FG_1_4.webp";
// import page4_2_2 from "./assets/4/2. FG_2_4.webp";
import page4_3 from "./assets/4/3. AMPLOP DIGITAL TXT_4.webp";
// import page4_4_1 from "./assets/4/4. USERNAME_ABI_4.webp";
// import page4_4_2 from "./assets/4/4. USERNAME_ERICA_4.webp";
// import page4_5 from "./assets/4/5. ART_4.webp";
import page4_6 from "./assets/4/6. TERIMAKASIH_4.webp";
// import page4_7_1 from "./assets/4/7. DAUN BG_1_4.webp";
// import page4_7_2 from "./assets/4/7. DAUN BG_2_4.webp";

function App() {
	// Get name from URL query parameters
	const urlParams = new URLSearchParams(window.location.search);
	const name = urlParams.get("name") || "Guest";
	const containerRef = useRef<HTMLDivElement>(null);
	const page1Ref = useRef<HTMLDivElement>(null);
	const page2Ref = useRef<HTMLDivElement>(null);
	const page3Ref = useRef<HTMLDivElement>(null);
	const page4Ref = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
	const [audioInitialized, setAudioInitialized] = useState(false);

	// Copy to clipboard function
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			// You could add a toast notification here if needed
			console.log("Copied to clipboard:", text);
		} catch (err) {
			console.error("Failed to copy: ", err);
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
		}
	};

	// Audio control functions
	const initializeAudio = useCallback(async () => {
		if (audioRef.current && !audioInitialized) {
			try {
				audioRef.current.volume = 0.3; // Set volume to 30%
				await audioRef.current.play();
				setIsAudioPlaying(true);
				setAudioInitialized(true);
			} catch (error) {
				console.log("Audio autoplay was prevented:", error);
				// Audio will be played when user interacts
			}
		}
	}, [audioInitialized]);

	const toggleAudio = async () => {
		if (!audioRef.current) return;

		try {
			if (isAudioPlaying) {
				audioRef.current.pause();
				setIsAudioPlaying(false);
			} else {
				await audioRef.current.play();
				setIsAudioPlaying(true);
				if (!audioInitialized) {
					setAudioInitialized(true);
				}
			}
		} catch (error) {
			console.log("Audio play failed:", error);
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// More robust scroll control
		let isScrolling = false;
		let scrollTimeout: number | null = null;
		let lastScrollTime = 0;
		const minScrollInterval = 800; // Minimum time between page changes

		// Handle scroll events for page navigation
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			const currentTime = Date.now();

			// Prevent rapid scrolling
			if (isScrolling || currentTime - lastScrollTime < minScrollInterval) {
				return;
			}

			// Clear any existing timeout
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}

			// Set a timeout to trigger the scroll after a brief delay
			// This ensures it's a deliberate scroll action
			scrollTimeout = setTimeout(() => {
				if (isScrolling) return;

				isScrolling = true;
				lastScrollTime = currentTime;

				const direction = e.deltaY > 0 ? 1 : -1;
				let newPage = currentPage + direction;

				// Clamp between 0 and 3
				newPage = Math.max(0, Math.min(3, newPage));

				if (newPage !== currentPage) {
					setCurrentPage(newPage);
					animateToPage(newPage);
				}

				// Reset scrolling flag after animation completes
				setTimeout(() => {
					isScrolling = false;
				}, 1200); // Match animation duration
			}, 100); // Small delay to ensure deliberate action
		};

		// Handle touch events for mobile
		let touchStartY = 0;
		let touchStartTime = 0;
		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();
		};

		const handleTouchEnd = (e: TouchEvent) => {
			if (isScrolling) return;

			const touchEndY = e.changedTouches[0].clientY;
			const diff = touchStartY - touchEndY;
			const touchDuration = Date.now() - touchStartTime;

			// Require larger swipe distance and reasonable swipe speed
			if (Math.abs(diff) > 100 && touchDuration < 500) {
				const currentTime = Date.now();

				// Prevent rapid touch navigation
				if (currentTime - lastScrollTime < minScrollInterval) {
					return;
				}

				isScrolling = true;
				lastScrollTime = currentTime;

				const direction = diff > 0 ? 1 : -1;
				let newPage = currentPage + direction;

				newPage = Math.max(0, Math.min(3, newPage));

				if (newPage !== currentPage) {
					setCurrentPage(newPage);
					animateToPage(newPage);
				}

				setTimeout(() => {
					isScrolling = false;
				}, 1200);
			}
		};

		const animateToPage = (pageIndex: number) => {
			if (container) {
				container.style.transform = `translateY(-${pageIndex * 100}vh)`;
			}
		};

		// Add event listeners
		container.addEventListener("wheel", handleWheel, { passive: false });
		container.addEventListener("touchstart", handleTouchStart, {
			passive: true,
		});
		container.addEventListener("touchend", handleTouchEnd, {
			passive: false,
		});

		// Initial animations
		const pageContents = document.querySelectorAll(".page-content");
		pageContents.forEach((content, index) => {
			const element = content as HTMLElement;
			element.style.opacity = "0";
			element.style.transform = "translateY(50px)";
			element.style.transition = "opacity 1s ease, transform 1s ease";

			setTimeout(
				() => {
					element.style.opacity = "1";
					element.style.transform = "translateY(0)";
				},
				500 + index * 200,
			);
		});

		// Try to initialize audio after a short delay
		const audioTimeout = setTimeout(() => {
			initializeAudio();
		}, 1000);

		// Add click listener to start audio on first user interaction
		const handleFirstClick = () => {
			if (!audioInitialized) {
				initializeAudio();
			}
			document.removeEventListener("click", handleFirstClick);
		};

		document.addEventListener("click", handleFirstClick);

		return () => {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			if (audioTimeout) {
				clearTimeout(audioTimeout);
			}
			document.removeEventListener("click", handleFirstClick);
			container.removeEventListener("wheel", handleWheel);
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchend", handleTouchEnd);
		};
	}, [currentPage, initializeAudio, audioInitialized]);

	return (
		<div className="app mobile-forced">
			{/* Audio element */}
			<audio
				ref={audioRef}
				src={backsoundUrl}
				loop
				preload="auto"
				aria-label="Background wedding music"
			>
				<track kind="captions" />
			</audio>

			{/* Audio control button */}
			<button
				type="button"
				className="audio-control"
				onClick={toggleAudio}
				aria-label={isAudioPlaying ? "Pause music" : "Play music"}
			>
				{isAudioPlaying ? "🔊" : "🔇"}
			</button>

			<div ref={containerRef} className="pages-container">
				{/* Page 1 */}
				<div ref={page1Ref} className="page page-1">
					<div className="page-content">
						<div className="absolute bottom-[300px] left-0 right-0">
							<div className="relative">
								<img src={page1_6} alt="Character" className="w-full" />
								<img src={page1_5} alt="Name" className="absolute bottom-0" />
								<img
									src={page1_4}
									alt="Date"
									className="absolute w-[200px] top-[100px]"
								/>
							</div>
						</div>

						<div className="absolute bottom-[150px]">
							<div className="relative w-3/4 mx-auto">
								<img src={page1_3} alt="Stamp" />
								<div className="absolute inset-0 flex items-center justify-center p-3 rotate-[-2deg]">
									{name}
								</div>
							</div>
						</div>

						{/* <img
							src={page1_2_1}
							alt="Foreground"
							className="absolute right-0 top-0 bottom-0 w-[50px]"
						/> */}
						{/* <img
							src={page1_2_2}
							alt="Foreground"
							className="absolute left-0 top-0 bottom-0 w-[50px]"
						/> */}

						<img
							src={page1_1_1}
							alt=""
							className="absolute top-0 right-0 w-[150px]"
						/>
						<img
							src={page1_1_2}
							alt=""
							className="absolute top-0 left-0 w-[150px]"
						/>
						<img
							src={page1_1_3}
							alt=""
							className="absolute bottom-0 right-0 w-[150px]"
						/>
						<img
							src={page1_1_4}
							alt=""
							className="absolute bottom-0 left-0 w-[150px]"
						/>
					</div>
				</div>

				{/* Page 2 */}
				<div ref={page2Ref} className="page page-2">
					<div className="page-content">
						<img
							src={page2_5}
							alt="Background"
							className="absolute bottom-[100px] w-3/4 left-0 right-0 mx-auto"
						/>
						<img
							src={page2_4_1}
							alt="Father"
							className="absolute bottom-[280px] right-0 w-1/4"
						/>
						<img
							src={page2_4_2}
							alt="Father"
							className="absolute bottom-[280px] left-0 w-1/4"
						/>

						<img
							src={page2_3_1}
							alt="Mother"
							className="absolute bottom-0 left-0 w-1/2"
						/>
						<img
							src={page2_3_2}
							alt="Mother"
							className="absolute bottom-0 right-0 w-1/2"
						/>

						<img src={page2_2} alt="Art" className="absolute bottom-0" />
						{/* <img src={page2_1} alt="Leaf" className="absolute" /> */}

						<img
							src={page1_1_1}
							alt=""
							className="absolute top-0 right-0 w-[150px]"
						/>
						<img
							src={page1_1_2}
							alt=""
							className="absolute top-0 left-0 w-[150px]"
						/>
						<img
							src={page1_1_3}
							alt=""
							className="absolute bottom-0 right-0 w-[120px]"
						/>
						<img
							src={page1_1_4}
							alt=""
							className="absolute bottom-0 left-0 w-[120px]"
						/>

						<img
							src={page2_0}
							alt="Greeting"
							className="absolute top-[50px] w-[90%] mx-auto inset-x-0"
						/>
					</div>
				</div>

				{/* Page 3 */}
				<div ref={page3Ref} className="page page-3">
					<div className="page-content">
						<div className="absolute top-[40px] left-0 right-0 z-10">
							<img src={page3_1} alt="" className="w-[200px] mx-auto" />
							<div className="relative mx-auto w-[350px]">
								<img
									src={page3_11}
									alt=""
									className="absolute left-0 top-0 bottom-0 w-[150px]"
								/>
								<img
									src={page3_9}
									alt=""
									className="absolute top-0 right-0 w-[60px]"
								/>
								<img src={page3_12} alt="" className="w-full" />
							</div>
						</div>

						<div className="absolute bottom-[150px]">
							<div className="relative">
								<img
									src={page3_8}
									alt=""
									className="w-[250px] mx-auto mb-[-20px]"
								/>
								<div className="relative">
									<img src={page3_5} alt="" className="relative" />
									<img
										src={page3_4_1}
										alt=""
										className="absolute left-0 bottom-[150px] h-[50px]"
									/>
									<img
										src={page3_4_2}
										alt=""
										className="absolute right-0 bottom-[150px] h-[50px]"
									/>
								</div>

								<img
									src={page3_7}
									alt=""
									className="w-[250px] mx-auto mt-[-20px]"
								/>
								<img
									src={page3_6}
									alt=""
									className="w-[290px] mx-auto mt-[-70px] pl-[20px]"
								/>
								<img
									src={page3_10}
									alt=""
									className="w-[180px] mx-auto mt-[10px]"
								/>
							</div>
						</div>

						<img
							src={page3_3_1}
							alt=""
							className="absolute bottom-0 left-0 w-[170px]"
						/>
						<img
							src={page3_3_2}
							alt=""
							className="absolute bottom-0 right-0 w-[150px]"
						/>

						<img
							src={page3_2_1}
							alt=""
							className="absolute bottom-0 right-0 w-[200px]"
						/>
						<img
							src={page3_2_2}
							alt=""
							className="absolute bottom-0 left-0 w-[200px]"
						/>

						<img
							src={page1_1_1}
							alt=""
							className="absolute top-0 right-0 w-[150px]"
						/>
						<img
							src={page1_1_2}
							alt=""
							className="absolute top-0 left-0 w-[150px]"
						/>
					</div>
				</div>

				{/* Page 4 */}
				<div ref={page4Ref} className="page page-4">
					<div className="page-content">
						{/* <img src={page4_7} alt="" className="absolute" /> */}
						{/* <img src={page4_5} alt="" className="absolute bottom-0" /> */}
						{/* <img src={page4_4} alt="" className="absolute" /> */}
						<div className="mt-[60px]">
							<div className="flex px-3">
								{/* <img src={page4_7_2} alt="" className="" /> */}
								<img src={page4_6} alt="" className="flex-1" />
								{/* <img src={page4_7_1} alt="" className="" /> */}
							</div>
							<img src={page4_3} alt="" className="w-[150px] mx-auto mt-5" />

							<div style={{ zIndex: 9 }}>
								<div className="layer gift-panel">
									<div className="gift-card">
										<h4>Abi Manyu Fajrul Falah</h4>

										<div className="gift-row">
											<span className="gift-label">BCA:</span>
											<div className="gift-field">
												<code id="abi-rek">1131466027</code>
												<button
													type="button"
													className="copy-btn"
													onClick={() => copyToClipboard("1131466027")}
												>
													Salin
												</button>
											</div>
										</div>
										<div className="gift-row">
											<span className="gift-label">
												Gopay / ShopeePay / Ovo:
											</span>
											<div className="gift-field">
												<code id="abi-ewallet">089667427861</code>
												<button
													type="button"
													className="copy-btn"
													onClick={() => copyToClipboard("089667427861")}
												>
													Salin
												</button>
											</div>
										</div>
									</div>
									<div className="gift-card">
										<h4>Erica Surya</h4>
										<div className="gift-row">
											<span className="gift-label">BCA:</span>
											<div className="gift-field">
												<code id="erica-rek">1132423401</code>
												<button
													type="button"
													className="copy-btn"
													onClick={() => copyToClipboard("1132423401")}
												>
													Salin
												</button>
											</div>
										</div>
										<div className="gift-row">
											<span className="gift-label">
												Gopay / ShopeePay / Ovo:
											</span>
											<div className="gift-field">
												<code id="erica-ewallet">085784622423</code>
												<button
													type="button"
													className="copy-btn"
													onClick={() => copyToClipboard("085784622423")}
												>
													Salin
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* <img src={page4_2} alt="" className="absolute" /> */}
						<img src={page4_1} alt="" className="absolute top-0" />

						{/* Gift card */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
