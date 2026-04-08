import {
  Atom,
  Braces,
  Code2,
  Database,
  FileCode2,
  Figma,
  GitBranch,
  Github,
  Globe,
  Layers,
  MonitorSmartphone,
  Server,
  Smartphone,
  Terminal,
  Coffee,
  Box,
} from "lucide-react";

const skills = [
  // Frontend
  { name: "HTML/CSS", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "React.js", category: "frontend" },
  { name: "React Native", category: "frontend" },
  { name: "Flutter", category: "frontend" },
  // Backend
  { name: "Node.js", category: "backend" },
  // Database
  { name: "MongoDB", category: "database" },
  { name: "SQL", category: "database" },
  // Tools & Platforms
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Android Studio", category: "tools" },
  { name: "Blender", category: "tools" },
  // Languages
  { name: "Dart", category: "language" },
  { name: "C", category: "language" },
  { name: "Java", category: "language" },
];

const categoryColors = {
  frontend: "142, 249, 252",
  backend: "142, 252, 204",
  database: "142, 202, 252",
  tools: "204, 142, 252",
  language: "252, 208, 142",
};

const skillIcons = {
  "HTML/CSS": Globe,
  JavaScript: FileCode2,
  "React.js": Atom,
  "React Native": Smartphone,
  Flutter: Layers,
  "Node.js": Server,
  MongoDB: Database,
  SQL: Database,
  Git: GitBranch,
  GitHub: Github,
  "Android Studio": Smartphone,
  Blender: Box,
  Dart: Braces,
  C: Terminal,
  Java: Coffee,
};

const fallbackColor = "142, 202, 252";
const FallbackIcon = Code2;

export const SkillsSection = () => {
  return (
    <section id="skills" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-3xl font-normal md:text-5xl">
            Technical Skills
          </h2>

          <p className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300">
            Proficient across frontend, backend, databases, tools, and multiple
            programming languages.
          </p>

          <div className="skills-rotator">
            <div className="wrapper">
              <div className="inner" style={{ "--quantity": skills.length }}>
                {skills.map((skill, index) => {
                  const SkillIcon = skillIcons[skill.name] ?? FallbackIcon;
                  const color = categoryColors[skill.category] ?? fallbackColor;

                  return (
                    <div
                      key={`${skill.name}-${skill.category}`}
                      className="card"
                      style={{
                        "--index": index,
                        "--color-card": color,
                      }}
                    >
                      <div className="img">
                        <SkillIcon size={30} strokeWidth={1.8} />
                        <span>{skill.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
