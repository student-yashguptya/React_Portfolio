import { Briefcase, Code, User } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const highlights = [
  {
    icon: Code,
    title: "Web & App Development",
    description:
      "Building responsive websites and Android applications with clean UI and robust backend systems.",
  },
  {
    icon: User,
    title: "UI/UX Design",
    description:
      "Designing intuitive, modern interfaces for web and mobile with a focus on usability and clarity.",
  },
  {
    icon: Briefcase,
    title: "Project Management",
    description:
      "Managing end-to-end delivery with agile workflows, clear communication, and quality execution.",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <motion.h2 variants={itemVariants} className="mb-8 sm:mb-10 md:mb-12 text-center text-2xl sm:text-3xl font-normal md:text-5xl">
            About Me
          </motion.h2>

          <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2">
            <motion.div variants={itemVariants} className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8">
              <h3 className="mb-4 text-xl sm:text-2xl font-medium">
                I&apos;m a developer crafting web and mobile products with
                intention.
              </h3>
              <p className="mb-4 text-sm sm:text-base text-gray-300">
                I specialize in building responsive, accessible, and
                high-performance applications using modern technologies and
                clean system design.
              </p>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-300">
                I care deeply about thoughtful user experience, strong
                engineering fundamentals, and delivering outcomes that scale.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <a
                  href="#contact"
                  className="rounded-lg bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-100 text-center"
                >
                  Start a Chat
                </a>
                <a
                  href="/Documents/Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass rounded-lg border border-white/20 px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black text-center"
                >
                  Download Resume
                </a>
              </div>
            </motion.div>

            <div className="grid gap-4">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    variants={itemVariants}
                    key={item.title}
                    className="liquid-glass rounded-xl border border-white/20 p-4 sm:p-5 transition-all duration-300 hover:border-white/30 hover:bg-white/5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-lg border border-white/20 p-2 flex-shrink-0">
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
