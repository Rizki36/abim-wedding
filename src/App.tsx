import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import backsoundUrl from "./assets/backsound.mp3";

// Page 1 assets
import page1_2 from "./assets/1/2. FG.webp";
import page1_3 from "./assets/1/3. STAMP.webp";
import page1_4 from "./assets/1/4. 26.webp";
import page1_5 from "./assets/1/5. NAMA.webp";
import page1_6 from "./assets/1/6. ART.webp";

// Page 2 assets
import page2_0 from "./assets/2/0. ASS.webp";
import page2_1 from "./assets/2/1. DAUN.webp";
import page2_2 from "./assets/2/2. ART.webp";
import page2_3 from "./assets/2/3. IBU.webp";
import page2_4 from "./assets/2/4. AYAH.webp";
import page2_5 from "./assets/2/5. BG CONTXT.webp";

// Page 3 assets
import page3_1 from "./assets/3/1. WAKTU DAN TEMPAT.webp";
import page3_2 from "./assets/3/2. DAUN.webp";
import page3_3 from "./assets/3/3. ART.webp";
import page3_4 from "./assets/3/4. TSAH.webp";
import page3_5 from "./assets/3/5. HANDSHAKE.gif";
import page3_6 from "./assets/3/6. RESEPSI NIKAH.webp";
import page3_7 from "./assets/3/7. TEMU JAWA.webp";
import page3_8 from "./assets/3/8. AKAD.webp";
import page3_9 from "./assets/3/9. LOC.webp";
import page3_10 from "./assets/3/10. COLOR.webp";
import page3_11 from "./assets/3/11. DATE.webp";
import page3_12 from "./assets/3/12. DATE BG.webp";

// Page 4 assets
import page4_1 from "./assets/4/1. DAUN.webp";
import page4_2 from "./assets/4/2. FG.webp";
import page4_3 from "./assets/4/3. AMPLOP DIGITAL TXT.webp";
import page4_4 from "./assets/4/4. USERNAME.webp";
import page4_5 from "./assets/4/5. ART.webp";
import page4_6 from "./assets/4/6. TERIMAKASIH.webp";
import page4_7 from "./assets/4/7. DAUN BG.webp";

gsap.registerPlugin(ScrollTrigger);

function App() {
	const containerRef = useRef<HTMLDivElement>(null);
	const page1Ref = useRef<HTMLDivElement>(null);
	const page2Ref = useRef<HTMLDivElement>(null);
	const page3Ref = useRef<HTMLDivElement>(null);
	const page4Ref = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [isAudioPlaying, setIsAudioPlaying] = useState(true);
	const [audioInitialized, setAudioInitialized] = useState(false);

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
			gsap.to(container, {
				y: `-${pageIndex * 100}vh`,
				duration: 1.2, // Slightly slower animation
				ease: "power2.inOut",
			});
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
		gsap.fromTo(
			".page-content",
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5 },
		);

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
		<div className="app">
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

			{/* Navigation dots */}
			<div className="navigation">
				{[0, 1, 2, 3].map((index) => (
					<button
						key={index}
						type="button"
						className={`nav-dot ${currentPage === index ? "active" : ""}`}
						onClick={() => {
							setCurrentPage(index);
							gsap.to(containerRef.current, {
								y: `-${index * 100}vh`,
								duration: 1.2,
								ease: "power2.inOut",
							});
						}}
					/>
				))}
			</div>

			<div ref={containerRef} className="pages-container">
				{/* Page 1: Welcome */}
				<div ref={page1Ref} className="page page-1">
					<div className="page-content">
						<img src={page1_4} alt="Date" className="absolute z-10" />
						<img src={page1_6} alt="Character" className="absolute" />
						<img src={page1_5} alt="Name" className="absolute" />
						<img src={page1_3} alt="Stamp" className="absolute" />
						<img src={page1_2} alt="Foreground" className="absolute" />
					</div>
					<div className="decorative-elements">
						<div className="heart-1">♥</div>
						<div className="heart-2">♥</div>
						<div className="heart-3">♥</div>
					</div>
				</div>

				{/* Page 2: Our Story */}
				<div ref={page2Ref} className="page page-2">
					<div className="page-content">
						<img src={page2_5} alt="Background" className="absolute" />
						<img src={page2_4} alt="Father" className="absolute" />
						<img src={page2_3} alt="Mother" className="absolute" />
						<img src={page2_2} alt="Art" className="absolute" />
						<img src={page2_1} alt="Leaf" className="absolute" />
						<img src={page2_0} alt="Greeting" className="absolute" />
					</div>
				</div>

				{/* Page 3: Wedding Details */}
				<div ref={page3Ref} className="page page-3">
					<div className="page-content">
						<img src={page3_6} alt="" className="absolute" />
						<img src={page3_7} alt="" className="absolute" />
						<img src={page3_8} alt="" className="absolute" />
						<img src={page3_4} alt="" className="absolute" />
						<img src={page3_12} alt="" className="absolute" />
						<img src={page3_9} alt="" className="absolute" />
						<img src={page3_11} alt="" className="absolute" />
						<img src={page3_5} alt="" className="absolute" />
						<img src={page3_10} alt="" className="absolute" />
						<img src={page3_3} alt="" className="absolute" />
						<img src={page3_2} alt="" className="absolute" />
						<img src={page3_1} alt="" className="absolute" />
					</div>
				</div>

				{/* Page 4: RSVP */}
				<div ref={page4Ref} className="page page-4">
					<div className="page-content">
						<img src={page4_2} alt="" className="absolute" />
						<img src={page4_3} alt="" className="absolute" />
						<img src={page4_4} alt="" className="absolute" />
						<img src={page4_5} alt="" className="absolute" />
						<img src={page4_7} alt="" className="absolute" />
						<img src={page4_6} alt="" className="absolute" />
						<img src={page4_1} alt="" className="absolute" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
