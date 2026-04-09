import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { staggerContainer, fadeUpSm } from "../lib/animations";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/student-yashguptya", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/yash-gupta-4178062a8/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/yash.gupta6/?next=%2F&hl=en", label: "Instagram" },
  ];

  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="border-t border-white/10 bg-black py-12 text-white"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          variants={fadeUpSm}
          className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4"
        >
          {/* Left: Branding & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <p className="text-base font-medium tracking-tight">
              Yash Gupta <span className="text-xs text-gray-400 font-normal ml-1">(Co-Founder & Developer)</span>
            </p>
            <p className="text-xs text-gray-500 max-w-xs text-center md:text-left">
              Co-Founder @ <a href="https://katalyxsolutions.com" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 transition-colors uppercase tracking-wider font-semibold">Katalyx Solutions</a>. 
              Building AI-driven digital products and scalable systems.
            </p>
          </div>

          {/* Center: Contact & Links */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <a 
              href="mailto:gyash6328@gmail.com" 
              className="text-xs text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"
            >
              <Mail size={14} className="text-emerald-400" />
              gyash6328@gmail.com
            </a>
          </div>

          {/* Right: Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} All rights reserved.
            </p>
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
              Built with React & Framer
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};