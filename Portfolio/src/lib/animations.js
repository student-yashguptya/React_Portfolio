/**
 * Premium animation variants — Katalyx-level motion design
 * Easing: cubic-bezier(0.16, 1, 0.3, 1) — spring-like, weighted, elegant
 */

const spring = [0.16, 1, 0.3, 1];
const smooth = [0.33, 1, 0.68, 1];

/* ─── Entrance variants ─────────────────────────────────────────── */

export const fadeUp = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: spring },
  },
};

export const fadeUpSm = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: spring },
  },
};

/** Clip-path reveal — slides text up from behind a mask */
export const headingReveal = {
  hidden: {
    opacity: 0,
    y: 38,
    clipPath: "inset(0 0 100% 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.72, ease: spring },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: spring },
  },
};

export const slideFromLeft = {
  hidden: { opacity: 0, x: -52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: spring },
  },
};

export const slideFromRight = {
  hidden: { opacity: 0, x: 52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: spring },
  },
};

/* ─── Container / stagger ───────────────────────────────────────── */

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

export const staggerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

/* ─── Decorative divider bar ────────────────────────────────────── */

export const dividerReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.85, ease: spring, delay: 0.18 },
  },
};

/* ─── Hover helpers (use as whileHover prop directly) ───────────── */

export const cardHoverProps = {
  whileHover: {
    y: -8,
    boxShadow: "0 40px 64px rgba(0,0,0,0.45)",
    transition: { duration: 0.32, ease: smooth },
  },
};

export const iconBoxHoverProps = {
  whileHover: {
    scale: 1.14,
    rotate: 6,
    transition: { duration: 0.24, ease: smooth },
  },
};

export const btnTapProps = {
  whileTap: { scale: 0.96, transition: { duration: 0.12 } },
  whileHover: { scale: 1.03, transition: { duration: 0.2, ease: smooth } },
};

export const tagHoverProps = {
  whileHover: {
    scale: 1.06,
    transition: { duration: 0.2, ease: smooth },
  },
};