import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const FadeIn = ({ children, delay = 0, duration = 1000, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AnimatedHeading = ({
  text,
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
  className = "",
}) => {
  const [animate, setAnimate] = useState(false);
  const lines = text.split("\n");

  useEffect(() => {
    const timeoutId = setTimeout(() => setAnimate(true), initialDelay);
    return () => clearTimeout(timeoutId);
  }, [initialDelay]);

  return (
    <h1
      className={className}
      style={{
        letterSpacing: "-0.04em",
      }}
    >
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        return (
          <span key={`line-${lineIndex}`} className="block">
            {line.split("").map((char, charIndex) => {
              const transitionDelay =
                lineIndex * lineLength * charDelay + charIndex * charDelay;

              return (
                <span
                  key={`char-${lineIndex}-${charIndex}`}
                  className="inline-block"
                  style={{
                    opacity: animate ? 1 : 0,
                    transform: animate ? "translateX(0)" : "translateX(-18px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${transitionDelay}ms`,
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
                charDelay={30}
                duration={500}
                className="mb-4 text-3xl font-normal leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              />

              <FadeIn delay={800} duration={1000}>
                <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg">
                  Full-stack developer crafting modern web and Android apps with
                  clean design, smooth performance, and real-world impact.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <a
                    href="#contact"
                    className="rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-100"
                  >
                    Start a Chat
                  </a>
                  <a
                    href="#projects"
                    className="liquid-glass rounded-lg border border-white/20 px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black"
                  >
                    Explore Now
                  </a>
                </div>
              </FadeIn>
            </div>

            <FadeIn
              delay={1400}
              duration={1000}
              className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end"
            >
              <div className="liquid-glass rounded-xl border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3">
                <p className="text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
                  Web. Mobile. Problem Solving.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
