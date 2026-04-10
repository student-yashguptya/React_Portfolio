import { useEffect, useRef } from "react";
import { HeroSection } from "../../Components/HeroSection";
import { AboutSection } from "../../Components/aboutsection";
import { EducationSection } from "../../Components/EducationSection";
import { ProfessionalSection } from "../../Components/professionalsection";
import { AchievementsSection } from "../../Components/achievementssection";
import { SkillsSection } from "../../Components/skillssection";
import { CertificationsSection } from "../../Components/certificationssection";
import { ProjectSection } from "../../Components/projectsection";
import { ContactSection } from "../../Components/contactsection";
import { CompanySection } from "../../Components/companysection";
import { Footer } from "../../Components/footer";
import { useScrollObserver } from "../../hooks/useScrollObserver";
import { GlowingTubeAnimation } from "../../Components/GlowingTubeAnimation";

export const Home = () => {
  useScrollObserver();

  const heroRef = useRef(null);

  // Dynamically calculate the top offset for stacked cards
  useEffect(() => {
    const updateStickyTops = () => {
      const cards = document.querySelectorAll('.sticky-card');
      const winH = window.innerHeight;
      cards.forEach(card => {
        const height = card.getBoundingClientRect().height;
        if (height > winH) {
          card.style.top = `-${height - winH}px`;
        } else {
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

      <div className="sticky-stack-container" style={{ position: "relative" }}>
        {/* Absolute wrapper starting exactly below the Hero (100vh) */}
        <div style={{
          position: "absolute",
          top: "100vh",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: 50,
          mixBlendMode: "difference" // Restores the automatic text contrast inversion!
        }}>
          <GlowingTubeAnimation />
        </div>

        {/* Hero Section Card */}
        <div
          ref={heroRef}
          className="sticky-card bg-black"
        >
          <HeroSection />
        </div>

        {/* Card 1: About, Education, Professional */}
        <div className="sticky-card about-card bg-black">
          <AboutSection />
          <EducationSection />
          <ProfessionalSection />
        </div>

        {/* Card 1.5: Company Section (Founder Role) */}
        <div className="sticky-card bg-black">
          <CompanySection />
        </div>

        {/* Card 2: Technical Skills */}
        <div className="sticky-card bg-black">
          <SkillsSection />
        </div>

        {/* Card 3: Projects */}
        <div className="sticky-card bg-black">
          <ProjectSection />
        </div>

        {/* Card 4: Achievements & Certifications */}
        <div className="sticky-card bg-black">
          <AchievementsSection />
          <CertificationsSection />
        </div>

        {/* Card 5: Contact */}
        <div className="sticky-card bg-black">
          <ContactSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};
