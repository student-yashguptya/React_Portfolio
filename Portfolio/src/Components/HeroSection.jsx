import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { motion } from "framer-motion";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const spring = [0.16, 1, 0.3, 1];
const smooth = [0.33, 1, 0.68, 1];

/* Character-by-character spring reveal */
const AnimatedHeading = ({
  text,
  initialDelay = 200,
  charDelay = 28,
  duration = 520,
  className = "",
}) => {
  const [animate, setAnimate] = useState(false);
  const lines = text.split("\n");

  useEffect(() => {
    const id = setTimeout(() => setAnimate(true), initialDelay);
    return () => clearTimeout(id);
  }, [initialDelay]);

  return (
    <h1 className={className} style={{ letterSpacing: "-0.04em" }}>
      {lines.map((line, lineIndex) => {
        const lineLen = line.length;
        return (
          <span key={`line-${lineIndex}`} className="block overflow-hidden">
            {line.split("").map((char, charIndex) => {
              const delay =
                lineIndex * lineLen * charDelay + charIndex * charDelay;
              return (
                <span
                  key={`c-${lineIndex}-${charIndex}`}
                  className="inline-block"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate
                      ? "translateY(0)"
                      : "translateY(22px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: `${duration}ms`,
                    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-black text-white font-sans"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <NavBar />

        <div className="flex flex-1 flex-col justify-end px-4 pb-8 sm:px-6 md:pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end gap-8">
            <div className="w-full">
              <AnimatedHeading
                text={"Yash Gupta\nBuilding digital experiences."}
                initialDelay={200}
                charDelay={28}
                duration={520}
                className="mb-4 text-3xl font-normal leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              />

              {/* Subtitle — word-level fade up */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.7, ease: spring }}
                className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg"
              >
                Full-stack developer crafting modern web and Android apps with
                clean design, smooth performance, and real-world impact.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.65, ease: spring }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="btn-shimmer rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-black"
                >
                  Start a Chat
                </motion.a>
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="btn-shimmer btn-shimmer-light liquid-glass rounded-lg border border-white/20 px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors duration-300"
                >
                  Explore Now
                </motion.a>
              </motion.div>
            </div>

            {/* Tagline pill */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.35, duration: 0.75, ease: spring }}
              className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.22, ease: smooth }}
                className="liquid-glass rounded-xl border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3"
              >
                <p className="text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
                  Web. Mobile. Problem Solving.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};