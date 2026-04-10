import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer, fadeUp, fadeUpSm, headingReveal, dividerReveal,
} from "../lib/animations";

const certifications = [
  {
    title: "Core Java under Industry Academia Interaction Program",
    issuer: "Softpro India",
    date: "2024",
  },
  {
    title: "Project-based Internship with Focus on App Development Practices",
    issuer: "Corizo & Wipro DICE",
    date: "Oct 2024 - Nov 2024",
  },
  {
    title: "Data Science Training Program",
    issuer: "Corizo & Wipro DICE",
    date: "Dec 2024 - Jan 2025",
  },
  {
    title: "Innovation, Design, and Entrepreneurship (IDE) Bootcamp",
    issuer: "AICTE & Ministry of Educations Innovation Cell (MIC)",
    date: "Feb 2025",
  },
];

export const CertificationsSection = () => {
  return (
    <section id="certifications" className="bg-black py-16 sm:py-20 md:py-24 text-white">
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
              Certifications
            </motion.h2>
          </div>

          <motion.div variants={dividerReveal} className="section-divider mx-auto mb-5 max-w-xs" />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Professional development and training programs completed.
          </motion.p>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <motion.article
                variants={fadeUp}
                key={`${cert.title}-${index}`}
                className="liquid-glass rounded-xl border border-white/20 p-4 sm:p-5 card-lift"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="icon-box rounded-lg border border-white/20 p-2 flex-shrink-0">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    {cert.date}
                  </p>
                </div>
                <h3 className="mb-1 text-sm sm:text-lg font-medium leading-snug break-words">
                  {cert.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">{cert.issuer}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};