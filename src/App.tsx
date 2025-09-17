import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import backsoundUrl from "./assets/backsound.mp3";
import backgroundGif from "./assets/background.gif";
import ThemedLoader from "./components/ThemedLoader";

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

import page3_rumah_5 from "./assets/3_rumah/5. BG TXT_3 RUMAH.webp";
import page3_rumah_6 from "./assets/3_rumah/6. MAPS_3 RUMAH.webp";
import page3_rumah_9 from "./assets/3_rumah/9. KEDIAMAN TXT_3 RUMAH.webp";

// Page 4 assets
import page4_1 from "./assets/4/1. DAUN_4.webp";
import page4_2 from "./assets/4/2. DAUN_BAWAH_2_5.webp";
import page4_3 from "./assets/4/3. AMPLOP DIGITAL TXT_3_5.webp";

// Page 5 assets
import page5_4_1 from "./assets/5/4. USERNAME_ABI_4.webp";
import page5_4_2 from "./assets/5/4. USERNAME_ERICA_4.webp";
import page5_5 from "./assets/5/5. ART_4.webp";
import page5_6 from "./assets/5/6. TERIMAKASIH_4.webp";

// Timing and gesture tuning (keep in sync with CSS transition in App.css)
const ANIMATION_MS = 900; // slide duration; must match .pages-container transition
const MIN_SCROLL_INTERVAL_MS = 500; // cooldown between page changes
const WHEEL_DEBOUNCE_MS = 50; // group small wheel pulses
const SWIPE_MIN_DISTANCE_PX = 70; // was 100 — a bit more sensitive
const SWIPE_MAX_DURATION_MS = 600; // was 500 — allow slightly slower swipes

function App() {
	// Get name from URL query parameters
	const urlParams = new URLSearchParams(window.location.search);
	const name = urlParams.get("name") || "Guest";
	const event = urlParams.get("event") || "Akad & Resepsi";
	const location = urlParams.get("location") || "gedung"; // gedung | rumah
	const containerRef = useRef<HTMLDivElement>(null);
	const page1Ref = useRef<HTMLDivElement>(null);
	const page2Ref = useRef<HTMLDivElement>(null);
	const page3Ref = useRef<HTMLDivElement>(null);
	const page4Ref = useRef<HTMLDivElement>(null);
	const page5Ref = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);
	const [audioInitialized, setAudioInitialized] = useState(false);
	// Loading state
	const [assetsProgress, setAssetsProgress] = useState(0);
	const [assetsReady, setAssetsReady] = useState(false);
	// Toast state
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [showToast, setShowToast] = useState(false);
	const toastTimeoutRef = useRef<number | null>(null);

	const triggerToast = useCallback((message: string) => {
		setToastMessage(message);
		setShowToast(true);
		if (toastTimeoutRef.current) {
			clearTimeout(toastTimeoutRef.current);
		}
		toastTimeoutRef.current = window.setTimeout(() => {
			setShowToast(false);
		}, 2000);
	}, []);

	// Copy to clipboard function
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			triggerToast("Tersalin ke clipboard");
			console.log("Copied to clipboard:", text);
		} catch (err) {
			console.error("Failed to copy via Clipboard API: ", err);
			// Fallback for older browsers
			try {
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.setAttribute("readonly", "");
				textArea.style.position = "absolute";
				textArea.style.left = "-9999px";
				document.body.appendChild(textArea);
				textArea.select();
				const ok = document.execCommand("copy");
				document.body.removeChild(textArea);
				if (ok) {
					triggerToast("Tersalin ke clipboard");
				} else {
					triggerToast("Gagal menyalin");
				}
			} catch (fallbackErr) {
				console.error("Fallback copy failed:", fallbackErr);
				triggerToast("Gagal menyalin");
			}
		}
	};

	// Cleanup toast timeout on unmount
	useEffect(() => {
		return () => {
			if (toastTimeoutRef.current) {
				clearTimeout(toastTimeoutRef.current);
			}
		};
	}, []);

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

	// Preload images and essential assets
	useEffect(() => {
		let isCancelled = false;
		// Collect all imported asset URLs used in pages
		const assetUrls: string[] = [
			backgroundGif,
			// Page 1
			page1_1_1,
			page1_1_2,
			page1_1_3,
			page1_1_4,
			page1_3,
			page1_4,
			page1_5,
			page1_6,
			// Page 2
			page2_0,
			page2_2,
			page2_3_1,
			page2_3_2,
			page2_4_1,
			page2_4_2,
			page2_5,
			// Page 3
			page3_1,
			page3_2_1,
			page3_2_2,
			page3_3_1,
			page3_3_2,
			page3_4_1,
			page3_4_2,
			page3_5,
			page3_6,
			page3_7,
			page3_8,
			page3_9,
			page3_10,
			page3_11,
			page3_12,
			page3_rumah_5,
			page3_rumah_6,
			page3_rumah_9,
			// Page 4
			page4_1,
			page4_2,
			page4_3,
			// Page 5
			page5_4_1,
			page5_4_2,
			page5_5,
			page5_6,
		];

		const total = assetUrls.length;
		if (total === 0) {
			setAssetsProgress(100);
			setAssetsReady(true);
			return;
		}

		let loaded = 0;
		const minDisplayMs = 1000; // show loader at least 1s for nicer UX
		const start = Date.now();

		const update = () => {
			loaded += 1;
			const pct = Math.min(100, Math.round((loaded / total) * 100));
			if (!isCancelled) setAssetsProgress(pct);
			if (loaded >= total) {
				const remaining = Math.max(0, minDisplayMs - (Date.now() - start));
				setTimeout(() => {
					if (!isCancelled) setAssetsReady(true);
				}, remaining);
			}
		};

		for (const src of assetUrls) {
			const img = new Image();
			img.onload = update;
			img.onerror = update;
			img.src = src;
		}

		return () => {
			isCancelled = true;
		};
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// More robust scroll control
		let isScrolling = false;
		let scrollTimeout: number | null = null;
		let lastScrollTime = 0;

		// Handle scroll events for page navigation
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			const currentTime = Date.now();

			// Prevent rapid scrolling
			if (
				isScrolling ||
				currentTime - lastScrollTime < MIN_SCROLL_INTERVAL_MS
			) {
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

				// Clamp between 0 and 4 (5 pages)
				newPage = Math.max(0, Math.min(4, newPage));

				if (newPage !== currentPage) {
					setCurrentPage(newPage);
					animateToPage(newPage);
				}

				// Reset scrolling flag after animation completes
				setTimeout(() => {
					isScrolling = false;
				}, ANIMATION_MS + 100); // a touch longer than animation
			}, WHEEL_DEBOUNCE_MS); // Small delay to ensure deliberate action
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
			if (
				Math.abs(diff) > SWIPE_MIN_DISTANCE_PX &&
				touchDuration < SWIPE_MAX_DURATION_MS
			) {
				const currentTime = Date.now();

				// Prevent rapid touch navigation
				if (currentTime - lastScrollTime < MIN_SCROLL_INTERVAL_MS) {
					return;
				}

				isScrolling = true;
				lastScrollTime = currentTime;

				const direction = diff > 0 ? 1 : -1;
				let newPage = currentPage + direction;

				newPage = Math.max(0, Math.min(4, newPage));

				if (newPage !== currentPage) {
					setCurrentPage(newPage);
					animateToPage(newPage);
				}

				setTimeout(() => {
					isScrolling = false;
				}, ANIMATION_MS + 100);
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

		// Try to initialize audio after a short delay (after assets ready)
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
			{/* Loader overlay */}
			{!assetsReady && (
				<ThemedLoader progress={assetsProgress} done={assetsReady} />
			)}
			{/* Toast */}
			{showToast && (
				<output
					className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg"
					aria-live="polite"
				>
					{toastMessage || "Tersalin"}
				</output>
			)}
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
				className={`audio-control ${isAudioPlaying ? "playing" : "paused"}`}
				onClick={toggleAudio}
				aria-label={isAudioPlaying ? "Pause music" : "Play music"}
				aria-pressed={isAudioPlaying}
			>
				<span aria-hidden className="icon" />
				<span className="sr-only">
					{isAudioPlaying ? "Pause music" : "Play music"}
				</span>
			</button>

			<div ref={containerRef} className="pages-container">
				{/* Page 1 */}
				<div ref={page1Ref} className="page page-1">
					<div className="page-content">
						<div className="relative z-10 mt-12">
							<img src={page1_6} alt="Character" className="w-full" />
							<img src={page1_5} alt="Name" className="absolute bottom-0" />
							<img
								src={page1_4}
								alt="Date"
								className="absolute w-[200px] top-[100px]"
							/>
						</div>

						<div className="relative w-3/4 mx-auto">
							<img src={page1_3} alt="Stamp" />
							<div className="absolute inset-0 flex flex-col items-center justify-center p-3 rotate-[-2deg]">
								<div>{name}</div>
								<div>{event}</div>
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
							src={page2_0}
							alt="Greeting"
							className="w-[90%] mx-auto relative z-10 mt-8 mb-[-60px]"
						/>
						<img src={page2_5} alt="Background" className="w-3/4 mx-auto" />
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
					</div>
				</div>

				{/* Page 3 */}
				<div ref={page3Ref} className="page page-3">
					{location === "rumah" && (
						<div className="page-content">
							<div className="mt-[40px] relative z-10">
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
									<a
										href="https://maps.app.goo.gl/xZeZFosWqoRB5nuo7"
										target="_blank"
										rel="noopener noreferrer"
									>
										<img src={page3_rumah_9} alt="" className="w-full" />
									</a>
								</div>
							</div>

							<div className="relative mt-[-20px]">
								<img
									src={page3_rumah_5}
									alt=""
									className="w-full mx-auto mb-[-50px]"
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
							</div>

							<div className="relative flex items-center justify-between mt-[-100px]">
								<img src={page3_3_1} alt="" className="w-[170px]" />
								<div>
									<img
										src={page3_rumah_6}
										alt=""
										className="absolute -z-10 inset-0 w-[120px] h-auto mx-auto mt-[80px]"
									/>
								</div>
								<img src={page3_3_2} alt="" className="w-[150px]" />
							</div>

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
					)}
					{location === "gedung" && (
						<div className="page-content">
							<div className="mt-[40px] z-10">
								<img
									src={page3_1}
									alt=""
									className="w-[200px] mx-auto relative z-10"
								/>
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
									<a
										href="https://maps.app.goo.gl/AGDtYprSn8Xo9KkY6"
										target="_blank"
										rel="noopener noreferrer"
									>
										<img src={page3_12} alt="" className="w-full" />
									</a>
								</div>
							</div>

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

							<div className="flex justify-between mt-[-150px]">
								<img src={page3_3_1} alt="" className="left-0 w-[170px]" />
								<img src={page3_3_2} alt="" className="right-0 w-[150px]" />
							</div>

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
					)}
				</div>

				{/* Page 4 */}
				<div ref={page4Ref} className="page page-4">
					<div className="page-content">
						<img
							src={page4_3}
							alt=""
							className="w-full max-w-[350px] px-5 mx-auto mt-28 mb-10"
						/>

						<div className="relative z-[9] mx-3">
							<div className="gift-card">
								{/* Decorative corner leaves */}
								<div className="gift-body">
									<div className="gift-section">
										<h4 className="gift-name">Abi Manyu Fajrul Falah</h4>
										<div className="gift-row">
											<span className="gift-label">BCA</span>
											<button
												type="button"
												className="gift-copy"
												onClick={() => copyToClipboard("1131466027")}
												aria-label="Salin nomor rekening 1131466027"
											>
												<code id="abi-rek" className="gift-code">
													1131466027
												</code>
												<span aria-hidden className="copy-icon" />
											</button>
										</div>
										<div className="gift-row">
											<span className="gift-label">
												Gopay / ShopeePay / Ovo
											</span>
											<button
												type="button"
												className="gift-copy"
												onClick={() => copyToClipboard("089667427861")}
												aria-label="Salin nomor e-wallet 089667427861"
											>
												<code id="abi-ewallet" className="gift-code">
													089667427861
												</code>
												<span aria-hidden className="copy-icon" />
											</button>
										</div>
									</div>

									<div className="gift-section">
										<h4 className="gift-name">Erica Surya</h4>
										<div className="gift-row">
											<span className="gift-label">BCA</span>
											<button
												type="button"
												className="gift-copy"
												onClick={() => copyToClipboard("1132423401")}
												aria-label="Salin nomor rekening 1132423401"
											>
												<code id="erica-rek" className="gift-code">
													1132423401
												</code>
												<span aria-hidden className="copy-icon" />
											</button>
										</div>
										<div className="gift-row">
											<span className="gift-label">
												Gopay / ShopeePay / Ovo
											</span>
											<button
												type="button"
												className="gift-copy"
												onClick={() => copyToClipboard("085784622423")}
												aria-label="Salin nomor e-wallet 085784622423"
											>
												<code id="erica-ewallet" className="gift-code">
													085784622423
												</code>
												<span aria-hidden className="copy-icon" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<img src={page4_1} alt="" className="absolute top-0" />
						<img src={page4_2} alt="" className="absolute bottom-0" />
					</div>
				</div>

				{/* Page 5 (Empty placeholder) */}
				<div ref={page5Ref} className="page page-5">
					<div className="page-content">
						<img src={page4_1} alt="" className="absolute top-0" />
						<img src={page5_6} alt="" className="mx-auto mt-12 max-w-[350px]" />
						<img src={page5_5} alt="" className="absolute bottom-0" />
						<img
							src={page5_4_1}
							alt=""
							className="absolute w-[150px] bottom-0 right-0"
						/>
						<img
							src={page5_4_2}
							alt=""
							className="absolute w-[150px] bottom-0 left-0"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
