import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer, fadeUp, fadeUpSm, headingReveal, dividerReveal, staggerFast,
} from "../lib/animations";

const educationItems = [
  {
    institute: "Madhavrao Scindia Public School, Bareilly",
    degree: "Intermediate",
    date: "March 2022",
  },
  {
    institute:
      "Shri Ram Murti Smarak College of Engineering and Technology",
    degree:
      "Bachelor of Technology in Computer Science and Engineering (CSE)",
    date: "June 2026",
  },
];

const subjects = [
  "Data Structure",
  "Database Management System",
  "Computer Networks",
  "Software Engineering",
];

export const EducationSection = () => {
  return (
    <section id="education" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto max-w-6xl"
        >
          <div className="overflow-hidden mb-3 sm:mb-4">
            <motion.h2
              variants={headingReveal}
              className="text-center text-2xl sm:text-3xl font-normal md:text-5xl"
            >
              Education
            </motion.h2>
          </div>

          <motion.div variants={dividerReveal} className="section-divider mx-auto mb-5 max-w-xs" />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Academic foundation that shaped my technical journey.
          </motion.p>

          <div className="space-y-4 sm:space-y-5">
            {educationItems.map((item) => (
              <motion.article
                variants={fadeUp}
                key={`${item.institute}-${item.date}`}
                className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-7 card-lift"
              >
                <div className="flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-start">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="icon-box rounded-lg border border-white/20 p-2 flex-shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-medium break-words">
                        {item.institute}
                      </h3>
                      <p className="mt-1 text-sm text-gray-300">{item.degree}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 md:whitespace-nowrap">
                    {item.date}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-8 sm:mt-10 md:mt-12 liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-7"
          >
            <h3 className="mb-4 text-lg font-medium">Subjects of Interest</h3>
            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 sm:gap-3"
            >
              {subjects.map((subject) => (
                <motion.span
                  key={subject}
                  variants={fadeUpSm}
                  whileHover={{ scale: 1.07, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                  transition={{ duration: 0.2 }}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm cursor-default transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  {subject}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};