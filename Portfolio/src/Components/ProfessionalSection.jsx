import { BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer, fadeUp, fadeUpSm, headingReveal, dividerReveal,
} from "../lib/animations";

const professionalItems = [
  {
    role: "Android App Development Intern",
    company: "Corizo",
    format: "Remote",
    duration: "Oct 2024 - Nov 2024",
  },
  {
    role: "Software Development Intern",
    company: "Jam Analytics Private Limited",
    format: "On-site Internship",
    duration: "1 July 2025 - 14 Aug 2025",
  },
];

export const ProfessionalSection = () => {
  return (
    <section id="professional" className="bg-black py-16 sm:py-20 md:py-24 text-white">
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
              Professional Experience
            </motion.h2>
          </div>

          <motion.div variants={dividerReveal} className="section-divider mx-auto mb-5 max-w-xs" />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Internship experiences where I delivered practical product work.
          </motion.p>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
            {professionalItems.map((item) => (
              <motion.article
                variants={fadeUp}
                key={`${item.role}-${item.company}`}
                className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-7 card-lift"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="icon-box rounded-lg border border-white/20 p-2 flex-shrink-0">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-medium">
                    {item.role}
                  </h3>
                </div>
                <p className="mb-2 text-sm sm:text-base text-gray-200">{item.company}</p>
                <p className="text-xs sm:text-sm text-gray-300">
                  {item.format} | {item.duration}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};