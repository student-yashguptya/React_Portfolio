import { Award } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer, fadeUp, fadeUpSm, headingReveal, dividerReveal,
} from "../lib/animations";

const achievements = [
  {
    title: "Smart India Hackathon (SIH) 2023",
    result: "Position: Waiting List Runner-Up",
  },
  {
    title: "UCER Prayagraj Hackathon",
    result: "Award: Most Scalable Solution",
  },
  {
    title: "SRMS CET Hackathon 1, 2 & 3",
    result: "Awards: Winner",
  },
];

export const AchievementsSection = () => {
  return (
    <section id="achievements" className="bg-black py-16 sm:py-20 md:py-24 text-white">
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
              Achievements
            </motion.h2>
          </div>

          <motion.div variants={dividerReveal} className="section-divider mx-auto mb-5 max-w-xs" />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Hackathon milestones highlighting performance and innovation.
          </motion.p>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {achievements.map((achievement) => (
              <motion.article
                variants={fadeUp}
                key={achievement.title}
                className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-6 card-lift"
              >
                <div className="mb-3 sm:mb-4 inline-flex icon-box rounded-lg border border-white/20 p-2">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-medium break-words">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-300">{achievement.result}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};