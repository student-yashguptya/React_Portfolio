import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const spring = [0.33, 1, 0.68, 1];

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative px-6 pt-6 md:px-12 lg:px-16">
      <nav
        className={`liquid-glass flex items-center justify-between rounded-xl px-4 py-2 transition-all duration-500 ${
          scrolled
            ? "shadow-[0_10px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
            : ""
        }`}
      >
        {/* Logo */}
        <motion.a
          href="#hero"
          className="text-2xl font-bold tracking-tight"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18 }}
        >
          Yash Gupta
        </motion.a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-link transition-colors duration-300 hover:text-gray-300">
              {item.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#contact"
          className="hidden rounded-lg bg-white px-6 py-2 text-sm font-medium text-black md:inline-flex btn-shimmer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.18 }}
        >
          Start a Chat
        </motion.a>

        {/* Mobile toggle */}
        <motion.button
          type="button"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          className="inline-flex rounded-md p-2 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          whileTap={{ scale: 0.88 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: spring }}
            className="liquid-glass mt-3 rounded-xl border border-white/20 p-4 md:hidden"
          >
            <div className="flex flex-col gap-3 text-sm">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.32, ease: spring }}
                  className="rounded-md px-2 py-1 transition-colors duration-300 hover:bg-white hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.055, duration: 0.32, ease: spring }}
                className="mt-2 rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-black btn-shimmer"
                onClick={() => setIsMenuOpen(false)}
              >
                Start a Chat
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};