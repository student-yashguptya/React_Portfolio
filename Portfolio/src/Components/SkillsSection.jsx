import {
  Atom, Braces, Code2, Database, FileCode2, Figma,
  GitBranch, Github, Globe, Layers, MonitorSmartphone,
  Server, Smartphone, Terminal, Coffee, Box,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer, fadeUpSm, headingReveal, dividerReveal, scaleIn,
} from "../lib/animations";

const skills = [
  { name: "HTML/CSS", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "React.js", category: "frontend" },
  { name: "React Native", category: "frontend" },
  { name: "Flutter", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "MongoDB", category: "database" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Android Studio", category: "tools" },
  { name: "Blender", category: "tools" },
  { name: "Dart", category: "language" },
  { name: "C", category: "language" },
 
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
  Git: GitBranch,
  GitHub: Github,
  "Android Studio": Smartphone,
  Blender: Box,
  Dart: Braces,
  C: Terminal,
  
};

const fallbackColor = "142, 202, 252";
const FallbackIcon = Code2;

export const SkillsSection = () => {
  return (
    <section id="skills" className="bg-black py-16 sm:py-20 md:py-24 text-white">
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
              Technical Skills
            </motion.h2>
          </div>

          <motion.div
            variants={dividerReveal}
            className="section-divider mx-auto mb-5 max-w-xs"
          />

          <motion.p
            variants={fadeUpSm}
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Proficient across frontend, backend, databases, tools, and multiple
            programming languages.
          </motion.p>

          <motion.div variants={scaleIn} className="skills-rotator">
            <div className="wrapper">
              <div className="inner" style={{ "--quantity": skills.length }}>
                {skills.map((skill, index) => {
                  const SkillIcon = skillIcons[skill.name] ?? FallbackIcon;
                  const color = categoryColors[skill.category] ?? fallbackColor;
                  return (
                    <div
                      key={`${skill.name}-${skill.category}`}
                      className="card"
                      style={{ "--index": index, "--color-card": color }}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};