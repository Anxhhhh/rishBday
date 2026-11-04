"use client";

import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Camera, Heart, ArrowLeft, PartyPopper, RefreshCw, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [photoSrc, setPhotoSrc] = useState<string>("/pics/pic10.jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const celebrationPhotoRef = useRef<HTMLInputElement>(null);

  // Passcode state
  const [passcode, setPasscode] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Surprise page state: 'ask' | 'rejected' | 'revealed' | 'wish' | 'gifts' | 'gift1' | 'gift2' | 'gift2_letter' | 'gift3'
  const [page2State, setPage2State] = useState<"ask" | "rejected" | "revealed" | "wish" | "gifts" | "gift1" | "gift2" | "gift2_letter" | "gift3">("ask");
  const [isCandleBlown, setIsCandleBlown] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);

  // Photobooth strip photos for Gift 1
  const [stripPhoto1, setStripPhoto1] = useState<string>("/pics/pic1.jpeg");
  const [stripPhoto2, setStripPhoto2] = useState<string>("/pics/pic2.jpeg");
  const photoInput1Ref = useRef<HTMLInputElement>(null);
  const photoInput2Ref = useRef<HTMLInputElement>(null);

  // Photo for Gift 2 (frameleft)
  const [letterPhoto, setLetterPhoto] = useState<string>("/pics/pic9.jpeg");
  const letterPhotoInputRef = useRef<HTMLInputElement>(null);

  // Photos for Gift 3 ("Museum of US" polaroids)
  const [museumPhoto1, setMuseumPhoto1] = useState<string>("/pics/pic3.jpeg");
  const [museumPhoto2, setMuseumPhoto2] = useState<string>("/pics/pic4.jpeg");
  const [museumPhoto3, setMuseumPhoto3] = useState<string>("/pics/pic5.jpeg");
  const [museumPhoto4, setMuseumPhoto4] = useState<string>("/pics/pic8.jpeg");
  const [museumPhoto5, setMuseumPhoto5] = useState<string>("/pics/pic12.jpeg");
  const museumPhoto1Ref = useRef<HTMLInputElement>(null);
  const museumPhoto2Ref = useRef<HTMLInputElement>(null);
  const museumPhoto3Ref = useRef<HTMLInputElement>(null);
  const museumPhoto4Ref = useRef<HTMLInputElement>(null);
  const museumPhoto5Ref = useRef<HTMLInputElement>(null);

  const handleMuseumPhoto1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMuseumPhoto1(URL.createObjectURL(file));
  };
  const handleMuseumPhoto2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMuseumPhoto2(URL.createObjectURL(file));
  };
  const handleMuseumPhoto3Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMuseumPhoto3(URL.createObjectURL(file));
  };
  const handleMuseumPhoto4Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMuseumPhoto4(URL.createObjectURL(file));
  };
  const handleMuseumPhoto5Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMuseumPhoto5(URL.createObjectURL(file));
  };

  const handleLetterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLetterPhoto(URL.createObjectURL(file));
    }
  };

  const handleStripPhoto1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStripPhoto1(URL.createObjectURL(file));
    }
  };

  const handleStripPhoto2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStripPhoto2(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoSrc(imageUrl);
    }
  };

  const fireCelebration = () => {
    const count = 250;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#ec4899", "#8b5cf6", "#fbbf24"] });
    fire(0.2, { spread: 60, colors: ["#a855f7", "#38bdf8", "#f43f5e"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const CORRECT_PASSCODE = "0808";

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio play error:", err);
      });
    }
  };

  const triggerUnlock = () => {
    setIsUnlocked(true);
    setPage2State("ask");
    fireCelebration();
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "#" || key === "backspace") {
      setPasscode((prev) => prev.slice(0, -1));
    } else if (key === "enter") {
      if (passcode === CORRECT_PASSCODE) {
        triggerUnlock();
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPasscode("");
        }, 500);
      }
    } else {
      if (passcode.length < 4) {
        const next = passcode + key;
        setPasscode(next);
        if (next.length === 4) {
          if (next === CORRECT_PASSCODE) {
            setTimeout(() => triggerUnlock(), 300);
          } else {
            setTimeout(() => {
              setShake(true);
              setTimeout(() => {
                setShake(false);
                setPasscode("");
              }, 500);
            }, 250);
          }
        }
      }
    }
  };

  // Keyboard support for numpad on desktop
  useEffect(() => {
    if (isUnlocked) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleKeyPress("#");
      } else if (e.key === "Enter") {
        handleKeyPress("enter");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isUnlocked, passcode]);

  const handleYesClick = () => {
    fireCelebration();
    setPage2State("revealed");
  };

  const handleNoClick = () => {
    setPage2State("rejected");
  };

  // Numpad key layout matching numpad.png
  const numpadKeys = [
    { label: "1", top: "27.5%", left: "20.5%", w: "18.5%", h: "13%" },
    { label: "2", top: "27.5%", left: "41.0%", w: "18.5%", h: "13%" },
    { label: "3", top: "27.5%", left: "61.5%", w: "18.5%", h: "13%" },
    { label: "4", top: "41.0%", left: "20.5%", w: "18.5%", h: "13%" },
    { label: "5", top: "41.0%", left: "41.0%", w: "18.5%", h: "13%" },
    { label: "6", top: "41.0%", left: "61.5%", w: "18.5%", h: "13%" },
    { label: "7", top: "54.5%", left: "20.5%", w: "18.5%", h: "13%" },
    { label: "8", top: "54.5%", left: "41.0%", w: "18.5%", h: "13%" },
    { label: "9", top: "54.5%", left: "61.5%", w: "18.5%", h: "13%" },
    { label: "#", top: "68.0%", left: "20.5%", w: "18.5%", h: "13%" },
    { label: "0", top: "68.0%", left: "41.0%", w: "18.5%", h: "13%" },
    { label: "enter", top: "80.5%", left: "33.5%", w: "33.0%", h: "10%" },
  ];

  // Dynamic Background:
  // - Lock Screen: bg.png (stripes)
  // - Ask & Rejected Screen: bg2.png (stars)
  // - Celebration Revealed Board: bg.png (stripes)
  // - Wish & Gifts Screen: bg2.png (stars)
  // - Gift 1 ("It's your dayyy" Screen): bg3.png (Canva Calendar background)
  // - Gift 2 Sealed Envelope Screen: envelop.png (Ivory Envelope with Heart Wax Seal)
  // - Gift 2 Letter & Gift 3 Museum Screen: bg2.png (stars / lavender)
  const currentBg =
    isUnlocked && page2State === "gift2"
      ? "url('/images/envelop.png')"
      : isUnlocked && page2State === "gift1"
      ? "url('/images/bg3.png')"
      : isUnlocked &&
        (page2State === "ask" ||
          page2State === "rejected" ||
          page2State === "wish" ||
          page2State === "gifts" ||
          page2State === "gift2_letter" ||
          page2State === "gift3")
      ? "url('/images/bg2.png')"
      : "url('/images/bg.png')";

  return (
    <div
      className="min-h-screen w-full transition-all duration-700 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: currentBg }}
    >
      {/* Background Audio */}
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />

      {/* Floating Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-pink-700 shadow-md hover:shadow-lg backdrop-blur-md border border-pink-200/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
        title={isPlaying ? "Mute music" : "Play music"}
        aria-label="Toggle music"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-pink-700">Playing</span>
            <span className="flex space-x-0.5 items-end h-3 ml-0.5">
              <span className="w-0.5 bg-pink-500 animate-[bounce_1s_infinite_100ms] h-full rounded-full"></span>
              <span className="w-0.5 bg-pink-500 animate-[bounce_1s_infinite_300ms] h-2 rounded-full"></span>
              <span className="w-0.5 bg-pink-500 animate-[bounce_1s_infinite_200ms] h-3 rounded-full"></span>
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            <span className="text-xs font-medium tracking-wide text-gray-600">Music Off</span>
          </>
        )}
      </button>
      {!isUnlocked ? (
        /* ================= SCREEN 1: LOCK SCREEN (Striped bg.png) ================= */
        <main className="min-h-screen w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 lg:px-14 py-4 sm:py-6 overflow-x-hidden relative animate-fadeIn">
          {/* CENTERED: 'unlock for surprise' Title */}
          <header className="w-full flex flex-col items-center justify-center text-center relative z-20 select-none pt-1 sm:pt-2">
            <div className="relative inline-block">
              <h1 className="font-serif-title text-7xl sm:text-8xl md:text-9xl lg:text-[9rem] xl:text-[10.5rem] font-bold text-[#7252a4] tracking-tight leading-none lowercase text-center drop-shadow-sm">
                unlock
              </h1>
              <span className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-black absolute top-[36%] left-[22%] sm:left-[25%] md:left-[27%] whitespace-nowrap pointer-events-none drop-shadow-sm -rotate-[4deg]">
                for surprise
              </span>
            </div>
          </header>

          {/* MAIN CONTENT ROW */}
          <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 my-4 sm:my-6 relative">
            {/* LEFT: Scalloped Photo Frame + Cat 3 */}
            <section className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[410px] md:h-[410px] lg:w-[440px] lg:h-[440px] xl:w-[490px] xl:h-[490px] flex items-center justify-center transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  title="Click to choose a photo for the frame"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />

                  <div className="absolute inset-[12%] rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={photoSrc}
                      alt="Birthday Photo"
                      className="w-full h-full object-cover select-none"
                    />

                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs sm:text-sm font-semibold gap-1.5 p-4 text-center">
                      <Camera className="w-6 h-6 animate-pulse" />
                      <span>Click to change photo</span>
                    </div>
                  </div>

                  <img
                    src="/images/photoframe.png"
                    alt="Photo Frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xl z-10"
                  />
                </div>

                {/* Cat 3: Standing Kitten with Pink Balloon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    fireCelebration();
                  }}
                  className="absolute -right-6 sm:-right-8 md:-right-10 bottom-0 z-20 w-[95px] sm:w-[125px] md:w-[145px] lg:w-[165px] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-xl select-none"
                  title="Tap the kitten with the balloon! 🎈"
                >
                  <img
                    src="/images/cat3.png"
                    alt="Standing Kitten with Pink Balloon"
                    className="w-full h-auto object-contain pointer-events-none"
                  />
                </div>
              </div>
            </section>

            {/* CENTER: Cat 1 (Heart Paws Cat) */}
            <section className="flex flex-col items-center justify-center z-20 self-center lg:-translate-y-12 xl:-translate-y-16 my-4 lg:my-0">
              <div
                onClick={fireCelebration}
                className="w-[170px] sm:w-[200px] md:w-[230px] lg:w-[250px] cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 drop-shadow-2xl select-none"
                title="Tap the kitty! 🐾"
              >
                <img
                  src="/images/cat1.png"
                  alt="Heart Paws Cat"
                  className="w-full h-auto object-contain pointer-events-none"
                />
              </div>
            </section>

            {/* RIGHT: Numpad Card + Cat 2 perched on TOP edge */}
            <section className="flex-1 flex flex-col items-center justify-center relative pt-20 sm:pt-24 lg:pt-28">
              <div
                className={`relative w-[260px] sm:w-[310px] md:w-[350px] lg:w-[380px] xl:w-[410px] aspect-[1144/1375] select-none transition-transform z-10 ${
                  shake ? "animate-shake" : ""
                }`}
              >
                {/* Cat 2 (Party Hat Kitten with Balloons) placed right on TOP edge of numpad */}
                <div
                  onClick={fireCelebration}
                  className="absolute -top-[35%] sm:-top-[38%] md:-top-[42%] right-2 sm:right-6 md:right-8 w-[115px] sm:w-[145px] md:w-[170px] lg:w-[190px] z-20 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-xl select-none"
                  title="Party Cat with Balloons! 🎈"
                >
                  <img
                    src="/images/cat2.png"
                    alt="Party Hat Cat with Balloons"
                    className="w-full h-auto object-contain pointer-events-none"
                  />
                </div>

                {/* Numpad Graphic */}
                <img
                  src="/images/numpad.png"
                  alt="Enter Passcode Numpad"
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
                />

                {/* 4 Passcode Display Boxes */}
                <div className="absolute top-[19.2%] left-[28.3%] w-[43.3%] h-[6.9%] flex items-center justify-between pointer-events-none px-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-[21%] h-full flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl transition-all"
                    >
                      {passcode[i] ? "★" : ""}
                    </div>
                  ))}
                </div>

                {/* Clickable Keys Overlay */}
                {numpadKeys.map((k) => (
                  <button
                    key={k.label}
                    onClick={() => handleKeyPress(k.label)}
                    style={{
                      top: k.top,
                      left: k.left,
                      width: k.w,
                      height: k.h,
                    }}
                    className="absolute rounded-full cursor-pointer transition-all duration-100 active:scale-90 hover:bg-purple-500/10 active:bg-purple-500/20 focus:outline-none"
                    title={`Press ${k.label}`}
                    aria-label={`Press ${k.label}`}
                  />
                ))}

                {/* On-Keypad Dedicated Backspace Button (Row 4, Right Slot next to 0) */}
                <button
                  onClick={() => handleKeyPress("backspace")}
                  style={{
                    top: "68.0%",
                    left: "61.5%",
                    width: "18.5%",
                    height: "13%",
                  }}
                  className="absolute rounded-full cursor-pointer transition-all duration-100 active:scale-90 hover:bg-purple-500/15 active:bg-purple-500/25 flex items-center justify-center text-[#68479c] group z-20"
                  title="Backspace (Delete digit)"
                  aria-label="Backspace"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/>
                  </svg>
                </button>
              </div>

              {/* Dedicated Backspace & Clear Buttons below numpad */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 z-20">
                <button
                  onClick={() => handleKeyPress("backspace")}
                  disabled={passcode.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-purple-50 text-[#68479c] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-purple-100"
                  title="Delete last digit"
                >
                  <span className="text-sm">⌫</span>
                  <span>Backspace</span>
                </button>
                {passcode.length > 0 && (
                  <button
                    onClick={() => setPasscode("")}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#7d689b] text-xs sm:text-sm font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100/50"
                    title="Clear all digits"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </section>
          </div>
        </main>
      ) : (
        /* ================= SCREEN 2 & 3: SURPRISE FLOW ================= */
        <main className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative animate-fadeIn overflow-hidden">
          {/* Top Bar with Navigation Controls (Hidden on screens with dedicated back buttons) */}
          {page2State !== "gift1" && page2State !== "gift2" && page2State !== "gift2_letter" && page2State !== "gift3" && (
            <div className="w-full flex items-center justify-between z-40 relative">
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setPasscode("");
                  setPage2State("ask");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 hover:bg-white backdrop-blur-md text-[#664697] font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lock Screen</span>
              </button>

              <button
                onClick={fireCelebration}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Confetti!</span>
              </button>
            </div>
          )}

          {page2State === "ask" ? (
            /* ================= VIEW A: "Wanna see it?" QUESTION CARD ================= */
            <div className="flex-1 w-full flex flex-col items-center justify-center my-auto z-20 select-none animate-fadeIn">
              {/* Peeking White Cat */}
              <div className="relative -mb-6 sm:-mb-8 z-30 w-[140px] sm:w-[170px] md:w-[190px] drop-shadow-md">
                <img
                  src="/images/peeking-cat.svg"
                  alt="Peeking Cat"
                  className="w-full h-auto object-contain pointer-events-none"
                />
              </div>

              {/* The Purple Framed Card */}
              <div className="relative w-full max-w-[420px] sm:max-w-[490px] md:max-w-[530px] bg-[#fbf9f2] border-[5px] sm:border-[6px] border-[#6d4ba4] rounded-[32px] sm:rounded-[40px] px-6 sm:px-10 py-8 sm:py-12 text-center shadow-xl shadow-purple-900/10">
                <h2 className="font-serif-title text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-[#664697] leading-[1.25] tracking-tight">
                  I have little
                  <br />
                  surprise for you.
                  <br />
                  Wanna see it?
                </h2>
              </div>

              {/* YES and NO Buttons */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 sm:mt-8 select-none">
                <button
                  onClick={handleYesClick}
                  className="px-8 sm:px-11 py-2.5 sm:py-3 rounded-full bg-white text-[#664697] font-bold text-lg sm:text-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  YES
                </button>

                <button
                  onClick={handleNoClick}
                  className="px-8 sm:px-11 py-2.5 sm:py-3 rounded-full bg-white/70 hover:bg-white text-[#664697] font-bold text-lg sm:text-xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer relative border border-purple-100 select-none"
                >
                  <span className="relative inline-block">
                    NO
                    <svg
                      className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none"
                      viewBox="0 0 60 30"
                    >
                      <path
                        d="M 5,16 Q 18,5 30,16 Q 42,26 55,14"
                        stroke="#664697"
                        strokeWidth="2.5"
                        fill="none"
                        opacity="0.6"
                      />
                      <path
                        d="M 8,20 Q 28,7 52,18"
                        stroke="#664697"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.5"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ) : page2State === "rejected" ? (
            /* ================= VIEW B: "How dare you click NO !" SCREEN ================= */
            <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center my-auto z-20 text-center select-none animate-fadeIn gap-6 sm:gap-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide drop-shadow-md">
                How dare you click NO !
              </h1>

              <div className="relative inline-flex items-center">
                <button
                  onClick={() => setPage2State("ask")}
                  className="px-8 sm:px-12 py-2.5 sm:py-3.5 rounded-full bg-white text-[#5d4499] font-extrabold text-xl sm:text-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  TRY AGAIN
                </button>

                <div className="absolute -right-10 sm:-right-12 -bottom-3 sm:-bottom-4 pointer-events-none select-none drop-shadow-md animate-bounce">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <path d="M 4 2 L 6 0 L 8 2 L 6 4 Z" fill="#6d4ba4" />
                    <path d="M 1 7 L 3 5 L 5 7 L 3 9 Z" fill="#ffffff" />
                    <path
                      d="M 7 2 L 7 18 L 11 14 L 15 22 L 18 20 L 14 12 L 20 12 Z"
                      fill="#ffffff"
                      stroke="#2b1f40"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="w-[260px] sm:w-[320px] md:w-[380px] drop-shadow-2xl rounded-2xl overflow-hidden mt-2">
                <img
                  src="/images/bubu-dudu-angry.gif"
                  alt="Bubu pinching Dudu cheek"
                  className="w-full h-auto object-contain pointer-events-none select-none"
                />
              </div>
            </div>
          ) : page2State === "wish" ? (
            /* ================= VIEW D: "BLOW AND MAKE A WISH" SCREEN ================= */
            <div className="flex-1 w-full max-w-6xl xl:max-w-7xl flex flex-col items-center justify-center my-auto z-20 relative select-none animate-fadeIn px-2 sm:px-4">
              
              {/* Top Navigation Bar */}
              <div className="w-full flex items-center justify-between mb-2 sm:mb-3 px-2">
                <button
                  onClick={() => setPage2State("revealed")}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white/85 hover:bg-white text-[#5d4499] text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs border border-purple-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Celebration Board</span>
                </button>

                <button
                  onClick={fireCelebration}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Confetti!</span>
                </button>
              </div>

              {/* The Wish Card Container (Expanded size matching Canva layout) */}
              <div className="relative w-full aspect-[1100/750] max-h-[86vh] flex items-center justify-center">
                
                {/* Wavy Frame Background Image */}
                <img
                  src="/images/wish-frame.svg"
                  alt="Wish Card Frame"
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl z-0"
                />

                {/* Inner Content Area */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-[6%] pb-[6%] px-[6%] sm:px-[8%]">
                  
                  {/* Arched Calligraphy Title: "blow and make a wish" with Underline Stroke */}
                  <div className="w-full flex items-center justify-center -mt-1 sm:-mt-3">
                    <svg viewBox="0 0 920 210" className="w-[96%] max-w-[800px] h-auto overflow-visible select-none pointer-events-none drop-shadow-xs">
                      <defs>
                        <path
                          id="wishArc"
                          d="M 60,165 Q 460,25 860,165"
                          fill="none"
                        />
                      </defs>

                      {/* Arched Underline Stroke directly below text (as in Canva screenshot) */}
                      <path
                        d="M 75,182 Q 460,42 845,182"
                        fill="none"
                        stroke="#66469b"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.95"
                      />

                      {/* Arched Calligraphy Text */}
                      <text
                        style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }}
                        className="text-[76px] sm:text-[90px] md:text-[104px]"
                        fill="#66469b"
                        letterSpacing="1px"
                      >
                        <textPath href="#wishArc" startOffset="50%" textAnchor="middle">
                          blow and make a wish
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Center Cake Section with Interactive Flame using authentic cake2.png */}
                  <div className="relative flex flex-col items-center justify-center -mt-4 sm:-mt-6">
                    
                    {/* The Cake Image Container with Moving Animation */}
                    <div
                      onClick={() => {
                        setIsCandleBlown(true);
                        fireCelebration();
                        setTimeout(() => {
                          setPage2State("gifts");
                        }, 800);
                      }}
                      className="relative w-[190px] sm:w-[250px] md:w-[300px] lg:w-[340px] cursor-pointer transition-transform duration-300 hover:scale-[1.05] active:scale-95 select-none drop-shadow-2xl animate-cake-float"
                      title="Click to blow out the candle & open gifts! 🎂🎁"
                    >
                      <img
                        src="/images/cake2.png"
                        alt="Authentic Birthday Wish Cake"
                        className="w-full h-auto object-contain pointer-events-none"
                      />

                      {/* Interactive Flame Mask & Smoke Effects */}
                      {isCandleBlown ? (
                        <>
                          {/* Cream oval overlay to cover the lit flame */}
                          <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-20 sm:w-24 h-24 sm:h-28 bg-[#fdfcf4] rounded-full pointer-events-none z-10" />

                          {/* Smoke Puff & Wish Granted Banner */}
                          <div className="absolute -top-7 sm:-top-9 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fadeIn pointer-events-none z-20">
                            <div className="text-3xl sm:text-4xl animate-bounce">
                              💨
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-[#5d4499] bg-white/95 px-3.5 py-1 rounded-full shadow-lg border border-purple-200 mt-1 whitespace-nowrap animate-pulse">
                              ✨ Wish Granted! ✨
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Flickering Flame Warm Glow Aura */
                        <div className="absolute top-[2%] left-1/2 w-20 sm:w-24 h-24 sm:h-28 pointer-events-none animate-flame-flicker rounded-full bg-amber-300/30 blur-md" />
                      )}
                    </div>

                    {/* Interactive Prompt below cake */}
                    <div className="mt-2 sm:mt-3 text-center">
                      {!isCandleBlown ? (
                        <button
                          onClick={() => {
                            setIsCandleBlown(true);
                            fireCelebration();
                            setTimeout(() => {
                              setPage2State("gifts");
                            }, 800);
                          }}
                          className="px-5 sm:px-7 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span>🕯️ Click to Blow the Candle!</span>
                          <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full">💨</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsCandleBlown(false)}
                            className="px-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#5d4499] font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-purple-200"
                          >
                            <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                            <span>Relight</span>
                          </button>
                          <button
                            onClick={() => setPage2State("gifts")}
                            className="px-5 py-2 rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <span>Open Gifts 🎁</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Right: Authentic Cool Cat with Sunglasses (cat6.png) */}
                  <div
                    onClick={fireCelebration}
                    className="absolute right-2 sm:right-5 md:right-8 -bottom-2 sm:-bottom-4 z-20 w-[125px] sm:w-[165px] md:w-[205px] lg:w-[245px] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl select-none"
                    title="Cool Birthday Cat! 😎 Click for confetti!"
                  >
                    <img
                      src="/images/cat6.png"
                      alt="Cool Cat with Sunglasses (cat6)"
                      className="w-full h-auto object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : page2State === "gifts" ? (
            /* ================= VIEW E: "SELECT ANY GIFT" SCREEN ================= */
            <div className="flex-1 w-full max-w-6xl xl:max-w-7xl flex flex-col items-center justify-center my-auto z-20 relative select-none animate-fadeIn px-2 sm:px-4">
              
              {/* Canva-Accurate Yellow Festive Background Doodles (Stars & Wavy Streamers from reference photo) */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top-Left: 8-Point Yellow Burst & Wavy Ribbon */}
                <div className="absolute top-2 left-2 sm:top-6 sm:left-6 animate-float opacity-85">
                  <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
                    <path d="M 40,0 L 44,28 L 72,12 L 52,36 L 80,40 L 52,44 L 72,68 L 44,52 L 40,80 L 36,52 L 8,68 L 28,44 L 0,40 L 28,36 L 8,12 L 36,28 Z" fill="#fef08a" />
                    <circle cx="40" cy="40" r="5" fill="#fde047" />
                  </svg>
                </div>
                <div className="absolute top-16 left-1 sm:left-4 animate-sway opacity-80">
                  <svg width="45" height="100" viewBox="0 0 45 100" fill="none">
                    <path d="M 22,0 Q 5,25 28,50 Q 45,75 16,100" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                {/* Left Edge: Serpentine Streamer */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1 sm:left-3 animate-floatReverse opacity-75">
                  <svg width="35" height="85" viewBox="0 0 35 85" fill="none">
                    <path d="M 18,0 Q 3,20 22,42 Q 35,64 12,85" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                {/* Top-Right: Wavy Streamer & Confetti Ribbon */}
                <div className="absolute top-4 right-4 sm:top-8 sm:right-10 animate-floatReverse opacity-85">
                  <svg width="55" height="110" viewBox="0 0 55 110" fill="none">
                    <path d="M 28,0 Q 50,28 18,55 Q -4,82 32,110" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div className="absolute top-24 right-2 sm:right-6 animate-twinkle opacity-80">
                  <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                    <path d="M 30,0 L 33,21 L 54,9 L 39,27 L 60,30 L 39,33 L 54,51 L 33,39 L 30,60 L 27,39 L 6,51 L 21,33 L 0,30 L 21,27 L 6,9 L 27,21 Z" fill="#fef08a" />
                  </svg>
                </div>

                {/* Right Edge: Vertical Serpentine Ribbon */}
                <div className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-4 animate-sway opacity-75">
                  <svg width="38" height="90" viewBox="0 0 38 90" fill="none">
                    <path d="M 20,0 Q 36,22 14,45 Q -2,68 25,90" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                {/* Bottom-Left: 8-Point Yellow Burst & Squiggle */}
                <div className="absolute bottom-6 left-2 sm:bottom-12 sm:left-6 animate-float opacity-85">
                  <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
                    <path d="M 40,0 L 44,28 L 72,12 L 52,36 L 80,40 L 52,44 L 72,68 L 44,52 L 40,80 L 36,52 L 8,68 L 28,44 L 0,40 L 28,36 L 8,12 L 36,28 Z" fill="#fef08a" />
                    <circle cx="40" cy="40" r="5" fill="#fde047" />
                  </svg>
                </div>

                {/* Bottom-Right: 8-Point Starburst & Confetti Ribbon */}
                <div className="absolute bottom-6 right-3 sm:bottom-10 sm:right-8 animate-floatReverse opacity-85">
                  <svg width="65" height="65" viewBox="0 0 80 80" fill="none">
                    <path d="M 40,0 L 44,28 L 72,12 L 52,36 L 80,40 L 52,44 L 72,68 L 44,52 L 40,80 L 36,52 L 8,68 L 28,44 L 0,40 L 28,36 L 8,12 L 36,28 Z" fill="#fef08a" />
                    <circle cx="40" cy="40" r="5" fill="#fde047" />
                  </svg>
                </div>
                <div className="absolute bottom-20 right-10 sm:bottom-28 sm:right-16 animate-twinkle opacity-80">
                  <svg width="45" height="70" viewBox="0 0 45 70" fill="none">
                    <path d="M 22,0 Q 8,18 24,35 Q 38,52 14,70" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Top Navigation Bar */}
              <div className="w-full flex items-center justify-between mb-2 sm:mb-3 px-2 z-20">
                <button
                  onClick={() => setPage2State("wish")}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-white/85 hover:bg-white text-[#5d4499] text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs border border-purple-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Cake</span>
                </button>

                <button
                  onClick={fireCelebration}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Confetti!</span>
                </button>
              </div>

              {/* The Gift Card Container (Matching Canva Layout) */}
              <div className="relative w-full aspect-[1100/750] max-h-[86vh] flex items-center justify-center z-10">
                
                {/* Wavy Frame Background Image */}
                <img
                  src="/images/wish-frame.svg"
                  alt="Gift Card Frame"
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl z-0"
                />

                {/* Inner Content Area */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-[7%] pb-[7%] px-[6%] sm:px-[10%]">
                  
                  {/* Top Pinned Parchment Banner: "select any gift" */}
                  <div className="relative inline-flex items-center justify-center mt-1 sm:mt-2">
                    
                    {/* Top-Left Pin Anchor (round pushpin head + needle) */}
                    <div className="absolute -left-3 -top-5 flex flex-col items-center pointer-events-none z-20 drop-shadow-md">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-700 shadow-sm" />
                      <div className="w-0.5 h-5 sm:h-6 bg-stone-700 -mt-1" />
                    </div>

                    {/* Bottom-Right Pin Anchor (needle + round pushpin head) */}
                    <div className="absolute -right-3 -bottom-5 flex flex-col items-center pointer-events-none z-20 drop-shadow-md">
                      <div className="w-0.5 h-5 sm:h-6 bg-stone-700 -mb-1" />
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-700 shadow-sm" />
                    </div>

                    {/* Yellow Parchment Banner */}
                    <div className="bg-[#feefb8] border-2 border-[#fcd34d] px-8 sm:px-14 py-2 sm:py-3 rounded-md shadow-md transform -rotate-1">
                      <span
                        style={{ fontFamily: "'Alex Brush', 'Dancing Script', 'Great Vibes', cursive" }}
                        className="text-3xl sm:text-4xl md:text-5xl text-[#923824] tracking-wide select-none font-semibold"
                      >
                        select any gift
                      </span>
                    </div>
                  </div>

                  {/* 3 Red Gift Boxes in a Row with Animations & giftsLogo.png */}
                  <div className="w-full flex items-center justify-center gap-4 sm:gap-8 md:gap-12 my-auto px-2">
                    {[1, 2, 3].map((boxNum) => {
                      const animClass =
                        boxNum === 1
                          ? "animate-gift-1"
                          : boxNum === 2
                          ? "animate-gift-2"
                          : "animate-gift-3";
                      return (
                        <div
                          key={boxNum}
                          onClick={() => {
                            setSelectedGift(boxNum);
                            fireCelebration();
                            if (boxNum === 1) {
                              setTimeout(() => {
                                setPage2State("gift1");
                              }, 600);
                            } else if (boxNum === 2) {
                              setTimeout(() => {
                                setPage2State("gift2");
                              }, 600);
                            } else if (boxNum === 3) {
                              setTimeout(() => {
                                setPage2State("gift3");
                              }, 600);
                            }
                          }}
                          className={`relative flex-1 max-w-[150px] sm:max-w-[210px] md:max-w-[260px] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group ${
                            selectedGift === boxNum
                              ? "scale-110 drop-shadow-[0_15px_30px_rgba(245,158,11,0.55)]"
                              : animClass
                          }`}
                          title={
                            boxNum === 1
                              ? "Click to open Gift #1! 🎁 (Opens 'It's your dayyy')"
                              : boxNum === 2
                              ? "Click to open Gift #2! 💌 (Opens Sealed Envelope)"
                              : "Click to open Gift #3! 📸 (Opens 'Museum of US')"
                          }
                        >
                          <img
                            src="/images/giftsLogo.png"
                            onError={(e) => {
                              // Seamless fallback to red-gift.svg until giftsLogo.png is placed
                              e.currentTarget.src = "/images/red-gift.svg";
                            }}
                            alt={`Gift Box ${boxNum}`}
                            className="w-full h-auto object-contain pointer-events-none transition-transform duration-300 group-hover:-translate-y-3 group-hover:rotate-2 drop-shadow-2xl"
                          />
                          
                          {/* Selected Indicator Badge */}
                          {selectedGift === boxNum && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full shadow-xl border-2 border-white whitespace-nowrap animate-bounce z-20">
                              ✨ Gift #{boxNum} Chosen! ✨
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Surprise Reveal Message when a gift is clicked */}
                  {selectedGift ? (
                    <div className="mt-1 sm:mt-2 text-center animate-fadeIn max-w-xl mx-auto">
                      <div className="inline-flex flex-col items-center gap-1.5 px-6 sm:px-8 py-3 rounded-2xl bg-white/95 shadow-xl border border-purple-200 text-[#5d4499]">
                        <div className="flex items-center gap-2 text-base sm:text-lg font-black text-[#5d4499]">
                          <span>
                            {selectedGift === 1 ? "💖 It's your dayyy! (Gift #1)" : selectedGift === 2 ? "🎂 Royal Birthday Feast!" : "✨ Big Dreams & Adventures!"}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#7861a8] font-medium leading-relaxed">
                          {selectedGift === 1
                            ? "Opening your special birthday calendar & memory photobooth strip... tap below if not redirected automatically!"
                            : selectedGift === 2
                            ? "An all-access pass to your favorite delicious treats, endless birthday cakes, and celebrating YOU like royalty!"
                            : "May all your biggest wishes come true this year! You are truly one of a kind. Keep shining bright!"}
                        </p>
                        
                        {selectedGift === 1 && (
                          <button
                            onClick={() => setPage2State("gift1")}
                            className="mt-1 px-5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Birthday Calendar & Memories 📸</span>
                            <span>→</span>
                          </button>
                        )}

                        {selectedGift === 2 && (
                          <button
                            onClick={() => setPage2State("gift2")}
                            className="mt-1 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Sealed Envelope 💌</span>
                            <span>→</span>
                          </button>
                        )}

                        {selectedGift === 3 && (
                          <button
                            onClick={() => setPage2State("gift3")}
                            className="mt-1 px-5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Enter Museum of US 📸</span>
                            <span>→</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedGift(null)}
                          className="mt-1 text-xs text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                        >
                          Unwrap another gift 🎁
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-[#7861a8] font-semibold italic text-center opacity-85">
                      Tap any gift box to open your surprise! ✨
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : page2State === "gift1" ? (
            /* ================= VIEW F: "IT'S YOUR DAYYY" SCREEN (Using user's bg3.png) ================= */
            <div className="flex-1 w-full max-w-7xl flex flex-col items-center justify-between my-auto z-20 relative select-none animate-fadeIn px-4 sm:px-8 py-2 sm:py-4 min-h-[85vh]">
              
              {/* Top Right "back" Button matching Canva screenshot */}
              <div className="w-full flex items-center justify-end mb-2 sm:mb-4 px-2 z-40">
                <button
                  onClick={() => setPage2State("gifts")}
                  className="px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-purple-50 text-[#68479c] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  back
                </button>
              </div>

              {/* Hidden file inputs for custom photobooth pictures */}
              <input
                ref={photoInput1Ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleStripPhoto1Upload}
              />
              <input
                ref={photoInput2Ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleStripPhoto2Upload}
              />

              {/* Main Content Area: Left side has bg3.png calendar, Right side has Photostrip */}
              <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-end relative my-auto">
                
                {/* Interactive Click Area over the Calendar & 29 Heart for Confetti */}
                <div
                  onClick={fireCelebration}
                  className="hidden lg:block absolute left-0 top-0 w-[64%] h-full cursor-pointer z-10"
                  title="Click anywhere on the calendar for confetti! 🎉"
                />

                {/* RIGHT: Authentic Photobooth Film Strip on top of bg3.png */}
                <div className="relative z-30 lg:mr-8 xl:mr-16 my-auto select-none">
                  <div className="relative bg-[#faf8f5] p-2.5 sm:p-3.5 pb-6 sm:pb-8 rounded-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-stone-200/60 transform -rotate-[2deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-300 w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px]">
                    
                    {/* Film Edge Tick Marks */}
                    <div className="absolute left-1 top-4 bottom-6 flex flex-col justify-between text-[7px] text-stone-400 font-mono select-none pointer-events-none">
                      <span>01</span>
                      <span>•</span>
                      <span>02</span>
                    </div>
                    <div className="absolute right-1 top-4 bottom-6 flex flex-col justify-between text-[7px] text-stone-400 font-mono select-none pointer-events-none">
                      <span>KODAK</span>
                      <span>400</span>
                    </div>

                    {/* Top Photo: Couple kissing cheek */}
                    <div
                      onClick={() => photoInput1Ref.current?.click()}
                      className="relative aspect-[4/3.4] overflow-hidden rounded-[2px] bg-stone-100 mb-2.5 cursor-pointer group/p1 shadow-xs border border-stone-200"
                      title="Click to change top photo"
                    >
                      <img
                        src={stripPhoto1}
                        alt="Birthday Photobooth Memory 1"
                        className="w-full h-full object-cover group-hover/p1:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/p1:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 p-2 text-center">
                        <Camera className="w-4 h-4 animate-pulse" />
                        <span>Change Photo</span>
                      </div>
                    </div>

                    {/* Bottom Photo: Couple funny duckface */}
                    <div
                      onClick={() => photoInput2Ref.current?.click()}
                      className="relative aspect-[4/3.4] overflow-hidden rounded-[2px] bg-stone-100 cursor-pointer group/p2 shadow-xs border border-stone-200"
                      title="Click to change bottom photo"
                    >
                      <img
                        src={stripPhoto2}
                        alt="Birthday Photobooth Memory 2"
                        className="w-full h-full object-cover group-hover/p2:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/p2:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 p-2 text-center">
                        <Camera className="w-4 h-4 animate-pulse" />
                        <span>Change Photo</span>
                      </div>
                    </div>

                    {/* Bottom Photostrip Watermark */}
                    <div className="mt-2.5 flex items-center justify-center text-stone-400 text-[11px] font-script tracking-widest opacity-80">
                      <span>memories ♡</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : page2State === "gift2" ? (
            /* ================= VIEW G: SEALED ENVELOPE SCREEN (Using user's envelop.png) ================= */
            <div className="flex-1 w-full max-w-7xl flex flex-col items-center justify-between my-auto z-20 relative select-none animate-fadeIn px-4 sm:px-8 py-2 sm:py-4 min-h-[85vh]">
              
              {/* Top Right "back" Button matching Canva layout */}
              <div className="w-full flex items-center justify-end mb-2 sm:mb-4 px-2 z-40">
                <button
                  onClick={() => setPage2State("gifts")}
                  className="px-6 sm:px-8 py-2 rounded-full bg-white/95 hover:bg-white text-[#68479c] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  back
                </button>
              </div>

              {/* Center Interactive Heart Wax Seal Hotspot */}
              <div className="flex-1 w-full flex items-center justify-center relative my-auto">
                <div className="relative flex flex-col items-center justify-center">
                  <button
                    onClick={() => {
                      fireCelebration();
                      setPage2State("gift2_letter");
                    }}
                    className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group relative focus:outline-none"
                    title="Click the heart seal to open! 💌"
                    aria-label="Open heart seal"
                  >
                    {/* Glowing pulse aura over the heart */}
                    <div className="absolute inset-4 rounded-full bg-red-500/20 group-hover:bg-red-500/35 blur-lg animate-pulse pointer-events-none transition-all" />
                    
                    {/* Interactive Click Prompt Pill */}
                    <div className="absolute -bottom-8 sm:-bottom-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[#991b1b] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border border-red-200 whitespace-nowrap pointer-events-none animate-bounce">
                      💌 Click Heart to Open!
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom Subtle Guidance Hint */}
              <div className="w-full text-center pb-2 z-20">
                <span className="text-xs sm:text-sm text-stone-600 font-semibold bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs">
                  Tap the heart seal in the center to unseal your surprise ✨
                </span>
              </div>
            </div>
          ) : page2State === "gift2_letter" ? (
            /* ================= VIEW H: BIRTHDAY LETTER & PHOTO FRAME (Using frameleft & frameright) ================= */
            <div className="flex-1 w-full max-w-7xl flex flex-col items-center justify-between my-auto z-20 relative select-none animate-fadeIn px-3 sm:px-6 md:px-8 py-2 sm:py-4">
              
              {/* Top Navigation */}
              <div className="w-full flex items-center justify-between mb-2 sm:mb-4 px-2 z-40">
                <button
                  onClick={() => setPage2State("gift2")}
                  className="px-4 sm:px-5 py-2 rounded-full bg-white/95 hover:bg-white text-[#68479c] font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-purple-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Envelope</span>
                </button>

                <button
                  onClick={() => setPage2State("gifts")}
                  className="px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-purple-50 text-[#68479c] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  back
                </button>
              </div>

              {/* Hidden file input for custom photo on left frame */}
              <input
                ref={letterPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLetterPhotoUpload}
              />

              {/* Main Content Row: Left Photo Frame + Right Birthday Letter */}
              <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-14 my-auto px-2">
                
                {/* LEFT: frameleft.png Photo Frame with Ribbon Bow */}
                <div
                  onClick={() => letterPhotoInputRef.current?.click()}
                  className="relative w-[270px] sm:w-[340px] md:w-[390px] lg:w-[430px] aspect-square transform -rotate-[5deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer group drop-shadow-2xl select-none shrink-0"
                  title="Click to change photo 📸"
                >
                  {/* Photo Container fitted strictly inside the inner frame cutout */}
                  <div
                    style={{
                      left: "19%",
                      top: "12.5%",
                      width: "63.5%",
                      height: "57.5%",
                    }}
                    className="absolute overflow-hidden bg-stone-200 z-0"
                  >
                    <img
                      src={letterPhoto}
                      alt="Birthday Couple Memory"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs sm:text-sm font-bold gap-1 p-2 text-center">
                      <Camera className="w-5 h-5 animate-pulse" />
                      <span>Click to change photo</span>
                    </div>
                  </div>

                  {/* frameleft.png overlay on top */}
                  <img
                    src="/images/frameleft.png"
                    alt="Lavender Plaid Frame with Bow"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                  />
                </div>

                {/* RIGHT: frameright.png Scalloped Note with Authentic Birthday Letter Text */}
                <div className="relative w-[300px] sm:w-[390px] md:w-[450px] lg:w-[490px] aspect-[1024/1360] select-none drop-shadow-2xl transform rotate-[1deg] hover:rotate-0 transition-transform duration-300 shrink-0">
                  {/* frameright.png Scalloped Stamp Paper Background */}
                  <img
                    src="/images/frameright.png"
                    alt="Scalloped Letter Paper"
                    className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                  />

                  {/* Birthday Letter Text Overlay matching Canva template */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 sm:p-9 md:p-11 text-center text-[#7e1c27]">
                    {/* Greeting Header */}
                    <h2 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight mb-2 sm:mb-4 leading-snug">
                      Happy birthday to my favourite<br />person! ❤️
                    </h2>

                    {/* Letter Body */}
                    <div className="text-[11px] sm:text-[13px] md:text-[14.5px] font-semibold leading-relaxed sm:leading-loose text-[#801c28] max-w-[95%] space-y-2 sm:space-y-3">
                      <p>
                        I hope this year brings you everything you&apos;ve been wishing for and so much more. Thank you for making my days happier, my bad days easier, and my life a little more beautiful just by being in it. 🥺💖
                      </p>
                      <p>
                        I&apos;m so lucky to have you, and I can&apos;t wait to make a million more memories with you. Here&apos;s to you, your dreams, and all the happiness you deserve.
                      </p>
                      <p className="pt-1">
                        Happy birthday, my love. I love you more than you know. 🫶🏻🎂❤️
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : page2State === "gift3" ? (
            /* ================= VIEW I: "MUSEUM OF US" POLAROID GALLERY SCREEN ================= */
            <div className="flex-1 w-full max-w-7xl flex flex-col items-center justify-between my-auto z-20 relative select-none animate-fadeIn px-2 sm:px-4 md:px-6 py-2 sm:py-4 min-h-[85vh]">
              
              {/* Top Right "back" Button matching Canva screenshot */}
              <div className="w-full flex items-center justify-end mb-1 sm:mb-2 px-2 z-40">
                <button
                  onClick={() => setPage2State("gifts")}
                  className="px-6 sm:px-8 py-1.5 sm:py-2 rounded-full bg-white hover:bg-purple-50 text-[#7a689e] font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-100"
                >
                  back
                </button>
              </div>

              {/* Title Section: "museum of US" + Pinned Mini Envelope matching Canva screenshot */}
              <div className="w-full flex flex-col items-center justify-center text-center select-none pt-1 sm:pt-2 mb-2 sm:mb-4">
                <div className="inline-flex items-baseline justify-center gap-2 sm:gap-4">
                  <span
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="italic text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-medium text-white drop-shadow-md tracking-tight leading-none"
                  >
                    museum
                  </span>
                  <span
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#911d29] tracking-tight leading-none drop-shadow-xs"
                  >
                    of US
                  </span>
                </div>

                {/* Miniature Cream Envelope with Red Wax Heart Seal */}
                <div className="relative mt-2 sm:mt-3 flex items-center justify-center drop-shadow-md">
                  <div className="w-12 h-7 sm:w-14 sm:h-9 bg-[#fdf7ea] rounded-[2px] shadow-sm border border-[#e6dcbf] relative overflow-hidden flex items-center justify-center">
                    {/* Envelope Flap Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 36" preserveAspectRatio="none">
                      <polygon points="0,0 28,20 56,0" fill="#f8eed2" stroke="#dfd2b0" strokeWidth="1" />
                      <line x1="0" y1="36" x2="24" y2="18" stroke="#dfd2b0" strokeWidth="1" />
                      <line x1="56" y1="36" x2="32" y2="18" stroke="#dfd2b0" strokeWidth="1" />
                    </svg>
                    {/* Red Heart Wax Seal */}
                    <div className="relative z-10 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#911d29] shadow-xs flex items-center justify-center border border-[#741520]">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden file inputs for customizing each Polaroid */}
              <input ref={museumPhoto1Ref} type="file" accept="image/*" className="hidden" onChange={handleMuseumPhoto1Upload} />
              <input ref={museumPhoto2Ref} type="file" accept="image/*" className="hidden" onChange={handleMuseumPhoto2Upload} />
              <input ref={museumPhoto3Ref} type="file" accept="image/*" className="hidden" onChange={handleMuseumPhoto3Upload} />
              <input ref={museumPhoto4Ref} type="file" accept="image/*" className="hidden" onChange={handleMuseumPhoto4Upload} />
              <input ref={museumPhoto5Ref} type="file" accept="image/*" className="hidden" onChange={handleMuseumPhoto5Upload} />

              {/* 5 Polaroids Scattered Artistically matching Canva layout - Staggered Wave (Never Wraps) */}
              <div className="w-full flex-1 flex flex-nowrap items-center justify-center -space-x-4 sm:-space-x-7 md:-space-x-10 lg:-space-x-12 xl:-space-x-14 my-auto py-8 sm:py-14 px-2 overflow-visible">
                
                {/* Polaroid 1: Top-Left (High & Tilted Left) */}
                <div
                  onClick={() => {
                    fireCelebration();
                    museumPhoto1Ref.current?.click();
                  }}
                  className="relative shrink-0 bg-white p-2 sm:p-2.5 md:p-3 pb-7 sm:pb-9 md:pb-11 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-[2px] border border-stone-200/50 transform -rotate-[11deg] -translate-y-7 sm:-translate-y-11 md:-translate-y-14 z-10 hover:z-40 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 w-[130px] sm:w-[165px] md:w-[195px] lg:w-[220px] cursor-pointer group"
                  title="Click to change photo 📸"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-100 shadow-inner">
                    <img src={museumPhoto1} alt="Museum Memory 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Polaroid 2: Lower-Left (Low & Tilted Right) */}
                <div
                  onClick={() => {
                    fireCelebration();
                    museumPhoto2Ref.current?.click();
                  }}
                  className="relative shrink-0 bg-white p-2 sm:p-2.5 md:p-3 pb-7 sm:pb-9 md:pb-11 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-[2px] border border-stone-200/50 transform rotate-[4deg] translate-y-6 sm:translate-y-9 md:translate-y-13 z-20 hover:z-40 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 w-[130px] sm:w-[165px] md:w-[195px] lg:w-[220px] cursor-pointer group"
                  title="Click to change photo 📸"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-100 shadow-inner">
                    <img src={museumPhoto2} alt="Museum Memory 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Polaroid 3: Center (Mid-High & Tilted Left) */}
                <div
                  onClick={() => {
                    fireCelebration();
                    museumPhoto3Ref.current?.click();
                  }}
                  className="relative shrink-0 bg-white p-2 sm:p-2.5 md:p-3 pb-7 sm:pb-9 md:pb-11 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-[2px] border border-stone-200/50 transform -rotate-[4deg] -translate-y-1 sm:-translate-y-2 md:-translate-y-4 z-15 hover:z-40 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 w-[135px] sm:w-[170px] md:w-[200px] lg:w-[225px] cursor-pointer group"
                  title="Click to change photo 📸"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-100 shadow-inner">
                    <img src={museumPhoto3} alt="Museum Memory 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Polaroid 4: Lower-Right (Low & Tilted Right) */}
                <div
                  onClick={() => {
                    fireCelebration();
                    museumPhoto4Ref.current?.click();
                  }}
                  className="relative shrink-0 bg-white p-2 sm:p-2.5 md:p-3 pb-7 sm:pb-9 md:pb-11 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-[2px] border border-stone-200/50 transform rotate-[5deg] translate-y-7 sm:translate-y-10 md:translate-y-14 z-25 hover:z-40 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 w-[130px] sm:w-[165px] md:w-[195px] lg:w-[220px] cursor-pointer group"
                  title="Click to change photo 📸"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-100 shadow-inner">
                    <img src={museumPhoto4} alt="Museum Memory 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Polaroid 5: Top-Right (High & Tilted Left) */}
                <div
                  onClick={() => {
                    fireCelebration();
                    museumPhoto5Ref.current?.click();
                  }}
                  className="relative shrink-0 bg-white p-2 sm:p-2.5 md:p-3 pb-7 sm:pb-9 md:pb-11 shadow-[0_15px_35px_rgba(0,0,0,0.22)] rounded-[2px] border border-stone-200/50 transform -rotate-[8deg] -translate-y-7 sm:-translate-y-10 md:-translate-y-14 z-10 hover:z-40 hover:rotate-0 hover:scale-110 active:scale-95 transition-all duration-300 w-[130px] sm:w-[165px] md:w-[195px] lg:w-[220px] cursor-pointer group"
                  title="Click to change photo 📸"
                >
                  <div className="aspect-square w-full overflow-hidden bg-stone-100 shadow-inner">
                    <img src={museumPhoto5} alt="Museum Memory 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* ================= VIEW C: THE GRAND BIRTHDAY REVEAL BOARD (Rich Festive Decorations) ================= */
            <div className="flex-1 w-full flex flex-col items-center justify-center my-auto z-20 relative select-none animate-fadeIn max-w-6xl xl:max-w-7xl px-2 sm:px-4">
              
              {/* Hanging Red Flag Bunting across the entire top */}
              <div className="absolute -top-12 sm:-top-16 md:-top-20 left-0 right-0 w-full h-16 sm:h-24 md:h-28 z-30 pointer-events-none drop-shadow-md">
                <img
                  src="/images/bunting.svg"
                  alt="Party Bunting Flags"
                  className="w-full h-full object-fill"
                />
              </div>

              {/* Side Cascading Streamers (Left & Right) */}
              <div className="hidden xl:block absolute -left-12 top-0 w-16 h-80 z-20 pointer-events-none">
                <img
                  src="/images/streamers-left.svg"
                  alt="Party Streamers Left"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden xl:block absolute -right-12 top-0 w-16 h-80 z-20 pointer-events-none">
                <img
                  src="/images/streamers-right.svg"
                  alt="Party Streamers Right"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Top Corner Floating Balloon Bouquets */}
              <div className="hidden md:block absolute -left-6 lg:-left-10 -top-6 lg:-top-10 z-20 w-[120px] lg:w-[150px] xl:w-[170px] pointer-events-none animate-float select-none">
                <img
                  src="/images/balloon-cluster-left.svg"
                  alt="Balloon Cluster"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="hidden md:block absolute -right-6 lg:-right-10 -top-6 lg:-top-10 z-20 w-[120px] lg:w-[150px] xl:w-[170px] pointer-events-none animate-float-delayed select-none">
                <img
                  src="/images/balloon-cluster-right.svg"
                  alt="Balloon Cluster"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Celebration Board using authentic photoFrame2.png */}
              <div className="relative w-full aspect-[1536/1024] flex items-center justify-center mt-4 sm:mt-6">
                
                {/* The actual photoFrame2.png image */}
                <img
                  src="/images/photoFrame2.png"
                  alt="Birthday Celebration Board Frame"
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-2xl z-0"
                />

                {/* Inner Content positioned inside the frame */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-[6%] pb-[7%] px-[7%] sm:px-[9%]">
                  
                  {/* Top Section: Photo (Left), Birthday Cake (Center), Disco Ball (Right) */}
                  <div className="w-full flex items-center justify-around gap-2 sm:gap-6 relative">
                    
                    {/* Photo Container with Polaroid Washi Tape & Party Hat */}
                    <div className="relative group cursor-pointer -rotate-1 transition-transform hover:rotate-0 duration-300">
                      <input
                        ref={celebrationPhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />

                      {/* Cute Pastel Washi Tape on Corners */}
                      <div className="absolute -top-2.5 left-4 w-10 sm:w-14 h-4 sm:h-5 bg-[#fef08a]/90 -rotate-12 rounded-xs shadow-xs border border-yellow-300/60 pointer-events-none z-30" />
                      <div className="absolute -top-2.5 right-4 w-10 sm:w-14 h-4 sm:h-5 bg-[#fbcfe8]/90 rotate-12 rounded-xs shadow-xs border border-pink-300/60 pointer-events-none z-30" />

                      {/* Purple Star Party Hat on Photo Corner */}
                      <div className="absolute -top-9 sm:-top-14 md:-top-18 -left-7 sm:-left-10 md:-left-13 z-30 w-[85px] sm:w-[120px] md:w-[145px] -rotate-[14deg] pointer-events-none drop-shadow-xl animate-sway">
                        <img
                          src="/images/party-hat-stars.svg"
                          alt="Party Hat"
                          className="w-full h-auto object-contain"
                        />
                      </div>

                      {/* Polaroid/Photo Card */}
                      <div
                        onClick={() => celebrationPhotoRef.current?.click()}
                        className="relative w-[190px] sm:w-[260px] md:w-[320px] lg:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 sm:border-6 border-white bg-white transition-transform hover:scale-[1.02]"
                        title="Click to change photo"
                      >
                        <img
                          src={photoSrc}
                          alt="Birthday Celebration Photo"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs sm:text-sm font-semibold gap-1">
                          <Camera className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                          <span>Change Photo</span>
                        </div>
                      </div>
                    </div>

                    {/* Cute 2-Tier Birthday Cake with Glowing Candles (Center Accent) */}
                    <div
                      onClick={fireCelebration}
                      className="hidden sm:flex flex-col items-center justify-center w-[75px] sm:w-[100px] md:w-[125px] lg:w-[145px] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 animate-cake-bounce select-none drop-shadow-xl"
                      title="Make a wish! 🎂 Click for confetti!"
                    >
                      <img
                        src="/images/birthday-cake.svg"
                        alt="Birthday Cake with Candles"
                        className="w-full h-auto object-contain pointer-events-none animate-pulseGlow"
                      />
                    </div>

                    {/* Disco Ball (dancingring.png) + Silver Star Balloon + Twinkle Sparkles + 'next' Button */}
                    <div className="flex flex-col items-center justify-center relative translate-y-[-4px]">
                      
                      {/* Floating Twinkle Sparkles around Disco Ball */}
                      <div className="absolute -top-3 -right-3 w-6 sm:w-9 md:w-11 pointer-events-none animate-twinkle select-none z-30">
                        <img src="/images/sparkle-star.svg" alt="Sparkle" className="w-full h-auto" />
                      </div>
                      <div className="absolute top-1/3 -left-5 w-5 sm:w-7 md:w-9 pointer-events-none animate-twinkle-fast select-none z-30">
                        <img src="/images/sparkle-star.svg" alt="Sparkle" className="w-full h-auto" />
                      </div>

                      {/* Disco Ball & Star Balloon Combo */}
                      <div
                        onClick={fireCelebration}
                        className="relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group"
                        title="Dance time! 🪩 Click for sparkles!"
                      >
                        {/* Hanging string */}
                        <div className="w-[1.5px] h-6 sm:h-8 bg-slate-400 -mb-1 opacity-70" />

                        {/* Authentic Disco Ball Image: dancingring.png */}
                        <div className="w-[115px] sm:w-[150px] md:w-[180px] lg:w-[205px] aspect-square relative drop-shadow-2xl">
                          <img
                            src="/images/dancingring.png"
                            alt="Mirror Disco Ball"
                            className="w-full h-full object-contain pointer-events-none rounded-full"
                          />
                        </div>

                        {/* Silver Foil Star Balloon floating under disco ball */}
                        <div className="w-[50px] sm:w-[65px] md:w-[78px] -mt-6 sm:-mt-8 ml-6 sm:ml-8 z-20 pointer-events-none drop-shadow-lg animate-float">
                          <img
                            src="/images/star-balloon.svg"
                            alt="Silver Star Balloon"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>

                      {/* 'next' link button */}
                      <button
                        onClick={() => {
                          setPage2State("wish");
                          fireCelebration();
                        }}
                        className="font-serif-title italic text-2xl sm:text-3xl lg:text-4xl text-[#5b3d91] hover:text-[#7452a8] underline decoration-[#5b3d91] underline-offset-4 font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer mt-0.5 sm:mt-1 drop-shadow-xs"
                      >
                        next
                      </button>
                    </div>
                  </div>

                  {/* Bottom Section: Official HAPPY BIRTHDAY Sticker Collage from hbd.png */}
                  <div className="w-full flex items-center justify-center relative pt-1 sm:pt-3">
                    
                    {/* Extra sparkle star beside Happy Birthday */}
                    <div className="hidden sm:block absolute left-[8%] -top-2 w-7 sm:w-9 pointer-events-none animate-twinkle select-none">
                      <img src="/images/sparkle-star.svg" alt="Sparkle" className="w-full h-auto" />
                    </div>
                    <div className="hidden sm:block absolute right-[8%] -top-2 w-7 sm:w-9 pointer-events-none animate-twinkle-fast select-none">
                      <img src="/images/sparkle-star.svg" alt="Sparkle" className="w-full h-auto" />
                    </div>

                    <div 
                      onClick={fireCelebration}
                      className="w-full flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                      title="Click for celebratory confetti! 🎉"
                    >
                      <img
                        src="/images/hbd.png"
                        alt="Happy Birthday Collage"
                        className="w-[88%] sm:w-[82%] md:w-[78%] max-w-[650px] h-auto object-contain drop-shadow-md pointer-events-none select-none"
                      />
                    </div>
                  </div>
                </div>

                {/* OVERLAPPING CORNER CHARACTERS (as in screenshot) */}
                
                {/* Bottom-Left: Cat holding balloons (cat5.png) */}
                <div
                  onClick={fireCelebration}
                  className="absolute -left-3 sm:-left-6 md:-left-10 lg:-left-12 -bottom-2 sm:-bottom-4 md:-bottom-6 z-30 w-[110px] sm:w-[160px] md:w-[205px] lg:w-[245px] cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 drop-shadow-2xl select-none"
                  title="Pop confetti! 🎈"
                >
                  <img
                    src="/images/cat5.png"
                    alt="Cat holding balloons"
                    className="w-full h-auto object-contain pointer-events-none"
                  />
                </div>

                {/* Bottom-Right: Party Hat Cat with Blower (cat4.png) + Gift Box */}
                <div className="absolute -right-2 sm:-right-4 md:-right-8 lg:-right-10 -bottom-2 sm:-bottom-4 md:-bottom-6 z-30 flex items-end">
                  
                  {/* Cute Gift Box Accent */}
                  <div
                    onClick={fireCelebration}
                    className="hidden md:block w-[60px] lg:w-[80px] -mr-4 mb-2 z-20 cursor-pointer transition-transform hover:scale-110 active:scale-95 drop-shadow-xl animate-float select-none"
                    title="Open your gift! 🎁"
                  >
                    <img
                      src="/images/gift-box.svg"
                      alt="Birthday Gift Box"
                      className="w-full h-auto object-contain pointer-events-none"
                    />
                  </div>

                  {/* Cat 4 with party blower */}
                  <div
                    onClick={fireCelebration}
                    className="w-[105px] sm:w-[150px] md:w-[190px] lg:w-[225px] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl select-none z-30"
                    title="Party cat! 🐾"
                  >
                    <img
                      src="/images/cat4.png"
                      alt="Party Hat Cat with Horn"
                      className="w-full h-auto object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
