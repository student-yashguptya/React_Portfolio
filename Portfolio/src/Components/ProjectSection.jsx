import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUp,
  fadeUpSm,
  headingReveal,
  dividerReveal,
} from "../lib/animations";

const projects = [
  {
    title: "HealthcareX24",
    type: "App + Website",
    description:
      "Comprehensive enterprise healthcare platform for patient management, instant doctor consultations, and medical records.",
    image: "/images/healthcare_x24_generated.png",
    fallbackImage: "/images/healthcare_x24_generated.png",
    liveUrl: "https://healthcarex24.com",
    tags: ["React", "Node.js", "MongoDB", "WebRTC"],
    accentClass: "border-emerald-400/40",
    rotation: -3,
    chipClass:
      "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  },
  {
    title: "Katalyx HR ERP",
    type: "Website",
    description:
      "Enterprise resource planning system tailored for HR operations, payroll processing, and employee lifecycle management.",
    image: "/images/katalyx_hr_erp_generated.png",
    fallbackImage: "/images/katalyx_hr_erp_generated.png",
    liveUrl: "https://katalyxhrerp.online",
    tags: ["React", "Express", "MongoDB", "Redux"],
    accentClass: "border-blue-400/40",
    rotation: 2,
    chipClass:
      "border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
  },
  {
    title: "AbhiRoom",
    type: "App + Website",
    description:
      "Smart property management and room booking application handling dynamic pricing, verified listings, and seamless user booking experience.",
    image: "/images/abhiroom_booking_generated.png",
    fallbackImage: "/images/abhiroom_booking_generated.png",
    liveUrl: "https://abhiroom.in",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    accentClass: "border-rose-400/40",
    rotation: 4,
    chipClass:
      "border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
  },
  {
    title: "Inventory Management System",
    type: "App",
    description:
      "An inventory operations app for tracking stock, updates, and day-to-day workflow management.",
    image: "/images/inventory_management_generated.png",
    fallbackImage: "/images/inventory_management_generated.png",
    liveUrl: null,
    tags: ["React Expo", "Node.js", "MongoDB", "Express"],
    accentClass: "border-white/20",
    rotation: -2,
    chipClass: "border-white/20 bg-white/5 text-gray-200 hover:bg-white/10",
  },
];

export const ProjectSection = () => {
  return (
    <section id="projects" className="bg-black py-16 sm:py-20 md:py-24 text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <div
          data-animate="stagger"
          className="mx-auto max-w-6xl"
        >
          <div className="overflow-hidden mb-3 sm:mb-4">
            <h2
              data-animate="heading"
              className="text-center text-2xl sm:text-3xl font-normal md:text-5xl"
            >
              Featured Projects
            </h2>
          </div>

          <div
            data-animate="scale-up"
            className="section-divider mx-auto mb-5 max-w-xs transition-all duration-700 ease-out"
          />

          <p
            data-animate="fade-up"
            className="mx-auto mb-8 sm:mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-gray-300"
          >
            Selected work across web and mobile products.
          </p>

          <div className="projects-grid grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
            {projects.map((project) => {
              const ctaHref = project.liveUrl ?? "#contact";
              const ctaLabel = project.liveUrl ? "View Project" : "Request Demo";

              return (
                <article
                  data-animate="slide-up"
                  key={project.title}
                  style={{ "--card-rotate": `${project.rotation}deg` }}
                  className={`project-glass-card overflow-hidden rounded-2xl border ${project.accentClass}`}
                >
                  {/* Image with zoom on card hover via CSS */}
                  <div
                    data-text={project.type}
                    className="project-card-media project-card-image-wrap relative h-40 sm:h-48 md:h-56 lg:h-60"
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = project.fallbackImage;
                      }}
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="mb-2 text-lg sm:text-xl md:text-2xl font-medium break-words">
                      {project.title}
                    </h3>
                    <p className="mb-4 text-xs sm:text-sm text-gray-300 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="mb-4 sm:mb-5 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <motion.span
                          key={tag}
                          whileHover={{ scale: 1.07 }}
                          transition={{ duration: 0.18 }}
                          className={`rounded-md border px-2 sm:px-2.5 py-1 text-xs font-medium transition-colors duration-200 cursor-default ${project.chipClass}`}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    <motion.a
                      href={ctaHref}
                      target={project.liveUrl ? "_blank" : undefined}
                      rel={project.liveUrl ? "noreferrer" : undefined}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="btn-shimmer inline-flex items-center gap-2 rounded-lg bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-black"
                    >
                      {ctaLabel} <ExternalLink size={16} />
                    </motion.a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};