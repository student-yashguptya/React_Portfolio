import { motion } from "framer-motion";
import { staggerContainer, fadeUpSm } from "../lib/animations";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="border-t border-white/10 bg-black py-8 text-white text-center"
    >
      <motion.div
        variants={fadeUpSm}
        className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p className="text-sm text-gray-400">
          &copy; {currentYear} Yash Gupta. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  );
};