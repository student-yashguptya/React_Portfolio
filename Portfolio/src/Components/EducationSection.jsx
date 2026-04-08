import { GraduationCap } from "lucide-react";
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

const educationItems = [
  {
    institute: "Madhavrao Scindia Public School, Bareilly",
    degree: "Intermediate",
    date: "March 2022",
  },
  {
    institute: "Shri Ram Murti Smarak College of Engineering and Technology",
    degree: "Bachelor of Technology in Computer Science and Engineering (CSE)",
    date: "June 2026",
  },
];

export const EducationSection = () => {
  return (
    <section id="education" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <motion.h2 variants={itemVariants} className="mb-3 sm:mb-4 text-center text-2xl sm:text-3xl font-normal md:text-5xl">
            Education
          </motion.h2>

          <motion.p variants={itemVariants} className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300">
            Academic foundation that shaped my technical journey.
          </motion.p>

          <div className="space-y-4 sm:space-y-5">
            {educationItems.map((item) => (
              <motion.article
                variants={itemVariants}
                key={`${item.institute}-${item.date}`}
                className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-7 transition-all duration-300 hover:border-white/30 hover:bg-white/5"
              >
                <div className="flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-start">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="rounded-lg border border-white/20 p-2 flex-shrink-0">
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

          <motion.div variants={itemVariants} className="mt-8 sm:mt-10 md:mt-12 liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-7">
            <h3 className="mb-4 text-lg font-medium">Subjects of Interest</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                "Data Structure",
                "Database Management System",
                "Computer Networks",
                "Software Engineering",
              ].map((subject) => (
                <span
                  key={subject}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  {subject}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
