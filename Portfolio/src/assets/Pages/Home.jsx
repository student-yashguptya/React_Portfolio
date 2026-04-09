import { useEffect } from "react";
import { HeroSection } from "../../Components/HeroSection";
import { AboutSection } from "../../Components/AboutSection";
import { EducationSection } from "../../Components/EducationSection";
import { ProfessionalSection } from "../../Components/ProfessionalSection";
import { AchievementsSection } from "../../Components/AchievementsSection";
import { SkillsSection } from "../../Components/SkillsSection";
import { CertificationsSection } from "../../Components/CertificationsSection";
import { ProjectSection } from "../../Components/ProjectSection";
import { ContactSection } from "../../Components/ContactSection";
import { Footer } from "../../Components/Footer";
import { useScrollObserver } from "../../hooks/useScrollObserver";

export const Home = () => {
  useScrollObserver();

  // Dynamically calculate the top offset for stacked cards
  // so that tall cards scroll completely before sticking.
  useEffect(() => {
    const updateStickyTops = () => {
      const cards = document.querySelectorAll('.sticky-card');
      const winH = window.innerHeight;
      cards.forEach(card => {
        const height = card.getBoundingClientRect().height;
        if (height > winH) {
          // If card is taller than screen, pin it such that its bottom aligns with screen bottom
          card.style.top = `-${height - winH}px`;
        } else {
          // If card is shorter/equal, pin it nicely at the top
          card.style.top = '0px';
        }
      });
    };

    updateStickyTops();
    window.addEventListener('resize', updateStickyTops);

    const resizeObserver = new ResizeObserver(() => {
      updateStickyTops();
    });

    document.querySelectorAll('.sticky-card').forEach(card => {
      resizeObserver.observe(card);
    });

    return () => {
      window.removeEventListener('resize', updateStickyTops);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="bg-black text-white font-sans overflow-clip">
      
      <div className="sticky-stack-container">
        {/* Hero Section Card */}
        <div className="sticky-card bg-black">
          <HeroSection />
        </div>

        {/* Card 1: About, Education, Professional, Achievements */}
        <div className="sticky-card bg-black">
          <AboutSection />
          <EducationSection />
          <ProfessionalSection />
          <AchievementsSection />
        </div>

        {/* Card 2: Technical Skills */}
        <div className="sticky-card bg-black">
          <SkillsSection />
        </div>

        {/* Card 3: Feature Cards (Projects) */}
        <div className="sticky-card bg-black">
          <ProjectSection />
        </div>

        {/* Card 4: Certifications & Contact */}
        <div className="sticky-card bg-black">
          <CertificationsSection />
          <ContactSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};
