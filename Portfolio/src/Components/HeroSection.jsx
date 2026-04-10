import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // ✅ NEW

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const spring = [0.16, 1, 0.3, 1];
const smooth = [0.33, 1, 0.68, 1];

/* ========================= */
/* TYPEWRITER COMPONENT */
/* ========================= */
const Typewriter = ({ words, delay = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), delay);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, delay]);

  return (
    <span className="inline-block min-w-[1ch]">
      {words[index].substring(0, subIndex)}
      <span className="inline-block w-[2px] h-[0.9em] bg-white ml-1 animate-pulse align-middle" />
    </span>
  );
};

/* ========================= */
/* NAME ANIMATION */
/* ========================= */
const NameHeading = ({ text, initialDelay = 200, className = "" }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimate(true), initialDelay);
    return () => clearTimeout(id);
  }, [initialDelay]);

  return (
    <h1 className={className} style={{ letterSpacing: "-0.04em" }}>
      <span className="block overflow-hidden">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(100%)",
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                i * 0.03
              }s`
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </h1>
  );
};

/* ========================= */
/* HERO SECTION */
/* ========================= */
export const HeroSection = () => {
  const words = ["experiences.", "solutions.", "applications.", "products."];

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-black text-white font-sans"
    >
      {/* 🎥 VIDEO BACKGROUND */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ========================= */}
      {/* 🐦 FULL HERO LOTTIE (NEW) */}
      {/* ========================= */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-40">
        <DotLottieReact
          src="https://lottie.host/e6c662ce-d8af-41b1-a970-df3ca9d6fe60/AVmTdmaCr3.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ========================= */}
      {/* 🐦 TOP 30% LOTTIE (NEW) */}
      {/* ========================= */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[30%] z-[2] opacity-50 overflow-hidden">
        <DotLottieReact
          src="https://lottie.host/e6c662ce-d8af-41b1-a970-df3ca9d6fe60/AVmTdmaCr3.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ========================= */}
      {/* 🎯 CONTENT */}
      {/* ========================= */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <NavBar />

        <div className="flex flex-1 flex-col justify-end px-5 pb-10 sm:px-8 md:pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end gap-8">
            <div className="w-full">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] sm:text-xs font-medium text-emerald-400"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Co-Founder @ Katalyx Solutions
              </motion.div>

              <NameHeading
                text="Yash Gupta"
                initialDelay={200}
                className="mb-1 text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-7xl"
              />

              <div className="mb-4 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: spring }}
                  className="text-xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl"
                >
                  Building digital <Typewriter words={words} />
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.7, ease: spring }}
                className="mb-8 max-w-2xl text-[13px] leading-relaxed text-gray-300 sm:text-base md:text-lg"
              >
                Co-Founder & Lead Engineer at{" "}
                <a
                  href="https://katalyxsolutions.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400 transition-all font-medium"
                >
                  Katalyx Solutions
                </a>
                , building AI-driven digital ecosystems and scalable,
                high-performance products. Full-Stack Developer crafting modern
                web and Android apps with clean design, seamless performance,
                and real-world impact.
              </motion.p>

              <motion.div className="flex items-center gap-2.5 sm:gap-4">
                <a
                  href="#contact"
                  className="btn-shimmer btn-premium inline-flex bg-white px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-black whitespace-nowrap"
                >
                  Get in Touch
                </a>
                <a
                  href="#projects"
                  className="btn-shimmer btn-premium btn-premium-outline inline-flex border border-white/20 px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm text-white whitespace-nowrap"
                >
                  View My Work
                </a>
              </motion.div>
            </div>

            <div className="mt-10 lg:mt-0 lg:flex lg:justify-end">
              <div className="rounded-full border border-white/20 px-5 py-2.5 sm:px-8 sm:py-4 backdrop-blur-md">
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight">
                  Web. Mobile. Problem Solving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};