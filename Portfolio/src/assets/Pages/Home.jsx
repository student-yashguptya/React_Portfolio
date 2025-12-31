import { AboutSection } from "../../Components/AboutSection";
import { ContactSection } from "../../Components/ContactSection";
import { HeroSection } from "../../Components/HeroSection";
import { NavBar } from "../../Components/NavBar";
import { ProjectSection } from "../../Components/ProjectSection";
import { SkillsSection } from "../../Components/SkillsSection";
import { StarBackground } from "../../Components/StarBackground";
import { ThemeToggle } from "../../Components/ThemeToggle";


export const Home = () =>{
    return (
    <div className="min-height-screen  bg-backgroung text-foreground overflow-x-hidden">
        {/* Theme Toggle */}
        <ThemeToggle />
        {/* Background Effects */}
        <StarBackground />
        {/* Navbar */}
        <NavBar />
        {/* Main Content */}
        <main>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectSection />
            <ContactSection />
        </main>
        {/* Footer */}
    </div>
    );
}