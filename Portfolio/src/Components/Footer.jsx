import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/10 bg-black py-8 text-white text-center"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">
          &copy; {currentYear} Yash Gupta. All rights reserved.
        </p>
        {/* <p className="text-sm text-gray-400 flex items-center gap-1">
          Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> globally
        </p> */}
        {/* <div className="text-sm text-gray-400">
          v1.0.0 Stable
        </div> */}
      </div>
    </motion.footer>
  );
};
