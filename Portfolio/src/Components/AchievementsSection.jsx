import { Award } from "lucide-react";

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
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-3xl font-normal md:text-5xl">
            Achievements
          </h2>

          <p className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300">
            Hackathon milestones highlighting performance and innovation.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {achievements.map((achievement) => (
              <article
                key={achievement.title}
                className="liquid-glass rounded-2xl border border-white/20 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:border-white/30 hover:bg-white/5"
              >
                <div className="mb-3 sm:mb-4 inline-flex rounded-lg border border-white/20 p-2">
                  <Award className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-base sm:text-lg font-medium break-words">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-300">{achievement.result}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
