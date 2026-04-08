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

export const Home = () => {
  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <ProfessionalSection />
      <AchievementsSection />
      <SkillsSection />
      <CertificationsSection />
      <ProjectSection />
      <ContactSection />
      <Footer />
    </div>
  );
};
