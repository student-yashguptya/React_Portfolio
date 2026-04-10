import { Briefcase, Code, User, Sparkles, Layers, Target } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Code,
    title: "Web & App Development",
    description:
      "Developing high-performance, responsive websites and Android applications with clean code.",
  },
  {
    icon: Sparkles, // Using Sparkles for UI/UX
    title: "Intelligence & Design",
    description:
      "Crafting intuitive, modern interfaces with a focus on seamless user experience across devices.",
  },
  {
    icon: Briefcase,
    title: "Project Management",
    description:
      "Leading end-to-end delivery with agile workflows and technical project leadership.",
  },
  {
    icon: Layers, // Using Layers for Architecture
    title: "Technical Architecture",
    description:
      "Designing scalable cloud systems and intelligent automation layers for enterprise workloads.",
  },
  {
    icon: Target, // Using Target for Strategy
    title: "Product Strategy",
    description:
      "Translating commercial vision into high-impact digital products and scalable solutions.",
  },
  {
    icon: User,
    title: "Strategic Leadership",
    description:
      "Co-founding and directing technical teams with a focus on innovation and market-ready growth.",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <div
          data-animate="stagger"
          className="mx-auto max-w-6xl"
        >
          {/* Heading clip reveal */}
          <div className="overflow-hidden mb-3 sm:mb-4">
            <h2
              data-animate="heading"
              className="text-center text-2xl sm:text-3xl font-normal md:text-5xl"
            >
              About Me
            </h2>
          </div>

          {/* Animated divider */}
          <div
            data-animate="scale-up"
            className="section-divider mx-auto mb-6 sm:mb-8 max-w-xs transition-all duration-700 ease-out"
          />

          <p
            data-animate="fade-up"
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Co-Founder @ Katalyx Solutions & Senior Full-Stack Developer 
            crafting high-performance web and mobile ecosystems with 
            clean design and intelligent automation.
          </p>

          <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2">
            {/* Left card — slide from left */}
            <div
              data-animate="slide-up"
              className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8 card-lift"
            >
              <h3 className="mb-4 text-xl sm:text-2xl font-medium">
                Designing and building digital products with a founder&apos;s mindset and a developer&apos;s precision.
              </h3>
              <p className="mb-4 text-sm sm:text-base text-gray-300">
                As a Co-Founder at <span className="text-white font-medium">Katalyx Solutions</span>, 
                I bridge the gap between architectural vision and hands-on execution. 
                I specialize in building responsive, high-performance applications 
                using modern frameworks and robust system design.
              </p>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-300">
                Whether I&apos;m architecting complex backend systems or refining 
                UI/UX interactions, I focus on delivering scalable outcomes that 
                drive real-world impact.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <motion.a
                  href="#contact"
                  className="btn-shimmer btn-premium inline-flex bg-white px-8 py-3.5 text-sm font-medium text-black text-center"
                >
                  Start a Chat
                </motion.a>
                <motion.a
                  href="/Documents/Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-shimmer btn-shimmer-light btn-premium btn-premium-outline inline-flex liquid-glass border border-white/20 px-8 py-3.5 text-sm font-medium text-white text-center"
                >
                  Download Resume
                </motion.a>
              </div>

              {/* Stats Row */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <h4 className="text-3xl font-medium text-white mb-1">
                    <span data-animate="count-up" data-target="15" data-suffix="+">0</span>
                  </h4>
                  <p className="text-xs text-gray-400">Projects Completed</p>
                </div>
                <div>
                  <h4 className="text-3xl font-medium text-white mb-1">
                    <span data-animate="count-up" data-target="99" data-suffix="%">0</span>
                  </h4>
                  <p className="text-xs text-gray-400">Client Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right cards — 2 column on desktop */}
            <div data-animate="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    data-animate="slide-up"
                    key={item.title}
                    className="liquid-glass rounded-xl border border-white/20 p-4 sm:p-5 card-lift"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="icon-box rounded-lg border border-white/20 p-2 flex-shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="mb-1 text-base sm:text-lg font-medium">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};