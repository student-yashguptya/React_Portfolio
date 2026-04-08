import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative px-6 pt-6 md:px-12 lg:px-16">
      <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
        <a href="#hero" className="text-2xl font-bold tracking-tight">
          Yash Gupta
        </a>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="transition-colors duration-300 hover:text-gray-300"
            >
              {item.name}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-100 md:inline-flex"
        >
          Start a Chat
        </a>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          className="inline-flex rounded-md p-2 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="liquid-glass mt-3 rounded-xl border border-white/20 p-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="rounded-md px-2 py-1 transition-colors duration-300 hover:bg-white hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-black transition-colors duration-300 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Start a Chat
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
