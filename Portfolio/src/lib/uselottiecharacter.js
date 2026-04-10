/**
 * useLottieCharacter.js — v4
 *
 * Root cause of v3 reset failure
 * ──────────────────────────────
 * Cards use `position: sticky`, so the hero div never actually leaves the
 * viewport — it stays pinned at top: 0 while other cards stack over it.
 * IntersectionObserver only fires when an element crosses a threshold in the
 * viewport. Since the hero never leaves, it never re-enters, so the observer
 * never fires the reset.
 *
 * Fix
 * ────
 * Drop the hero IntersectionObserver entirely. Instead, detect reset inside
 * the scroll handler using raw scrollY. If the user scrolls back within
 * 25% of viewport height from the top after sections have played, trigger
 * a full reset. scrollY is unaffected by sticky positioning.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAnimation } from 'framer-motion';

/* ─── Layout constants ─────────────────────────────────────────────────────── */
export const SIZE_DESKTOP = 160;
export const SIZE_MOBILE  = 96;
export const FLOOR_GAP    = 5;


/* ─── Phase enum ───────────────────────────────────────────────────────────── */
export const Phase = Object.freeze({
  IDLE:       'IDLE',
  ENTRY_FALL: 'ENTRY_FALL',
  SETTLED:    'SETTLED',
  RISING:     'RISING',
  JUMPING:    'JUMPING',
  FALLING:    'FALLING',
  FINAL:      'FINAL',
});

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const getSize   = () =>
  typeof window !== 'undefined' && window.innerWidth < 640
    ? SIZE_MOBILE
    : SIZE_DESKTOP;

export const getRightX = () => {
  const sz = getSize();
  const gap = window.innerWidth < 640 ? 16 : FLOOR_GAP;
  return window.innerWidth - sz - gap;
};

export const getLeftX = () => (window.innerWidth < 640 ? 16 : FLOOR_GAP);
export const getAboveY = () => -(window.innerHeight + getSize() + 80);
export const getRiseY  = () => -(window.innerHeight * 0.44);
export const getJumpY  = () => -(window.innerHeight * 0.83);

/* ─── Transitions ──────────────────────────────────────────────────────────── */
const T = {
  entryFall:   { type: 'spring', stiffness: 120, damping: 20, mass: 2.0  },
  sectionFall: { type: 'spring', stiffness: 180, damping: 24, mass: 2.0  },
  rise:        { duration: 1.2,  ease: [0.16, 1, 0.3, 1]                 },
  jump:        { duration: 0.28, ease: [0.34, 1.56, 0.64, 1]             },

  squishIn:    { duration: 0.11, ease: 'easeOut'                          },
  squishOut:   { type: 'spring', stiffness: 420, damping: 20              },
};

/* ─── Hook ─────────────────────────────────────────────────────────────────── */
export function useLottieCharacter(loaderDone) {
  const controls = useAnimation();

  const phase              = useRef(Phase.IDLE);
  const side               = useRef('right');
  const hasCrossedSections = useRef(false);
  const observers          = useRef([]);
  const scrollDown         = useRef(true);
  const lastScrollY        = useRef(0);
  const setupRef           = useRef(null);
  const triggerResetRef    = useRef(null); // keeps scroll handler stale-free

  const [visible, setVisible] = useState(false);

  const [initX] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const sz = getSize();
    const gap = window.innerWidth < 640 ? 16 : FLOOR_GAP;
    return window.innerWidth - sz - gap;
  });
  const [initY] = useState(() => {
    if (typeof window === 'undefined') return -1200;
    return getAboveY();
  });

  /* ── Squash-and-stretch ─────────────────────────────────────────────────── */
  const squish = useCallback(async () => {
    await controls.start({ scaleY: 0.72, scaleX: 1.24, transition: T.squishIn });
    await controls.start({ scaleY: 1,    scaleX: 1,    transition: T.squishOut });
  }, [controls]);

  /* ── Full reset ─────────────────────────────────────────────────────────── */
  const triggerReset = useCallback(() => {
    /* Atomically own the phase — nothing else can interject */
    phase.current              = Phase.IDLE;
    side.current               = 'right';
    hasCrossedSections.current = false;

    /* Stop any in-flight spring BEFORE teleporting.
       A running spring keeps writing y and will overwrite controls.set(). */
    controls.stop();

    /* Instant teleport above viewport */
    controls.set({
      x:      getRightX(),
      y:      getAboveY(),
      scaleX: 1,
      scaleY: 1,
    });

    /* Small delay lets the teleport paint before the fall begins */
    setTimeout(() => {
      phase.current = Phase.ENTRY_FALL;
      controls
        .start({ y: 0, transition: T.entryFall })
        .then(async () => {
          await squish();
          phase.current = Phase.SETTLED;
          /* Rebuild all section observers for the next downward pass */
          setupRef.current?.();
        });
    }, 80);
  }, [controls, squish]);

  /* Keep triggerResetRef current so scroll handler never goes stale */
  useEffect(() => { triggerResetRef.current = triggerReset; }, [triggerReset]);

  /* ── Scroll handler ─────────────────────────────────────────────────────── */
  /* 
   * This is the only reliable reset trigger for sticky-card layouts.
   *
   * IntersectionObserver on the hero div does NOT work here because the hero
   * uses `position: sticky` and never actually leaves the viewport — it stays
   * pinned at top: 0 while other cards stack over it. Since the element was
   * never "out", there is no "re-entry" event to observe.
   *
   * scrollY is unaffected by sticky positioning. When the user scrolls back
   * near the top (within 25% of viewport height), we know the hero is visible
   * and the cycle should restart.
   */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      scrollDown.current  = y >= lastScrollY.current;
      lastScrollY.current = y;

      /* Reset conditions:
         1. Near the top of the page (within 25vh of origin)
         2. Scrolling upward — prevents firing on initial downward scroll
         3. Sections were actually played (not just opened page fresh)
         4. Not already in a reset or entry animation              */
      const nearTop = y < window.innerHeight * 0.25;
      const canReset =
        nearTop &&
        !scrollDown.current &&
        hasCrossedSections.current &&
        phase.current !== Phase.IDLE &&
        phase.current !== Phase.ENTRY_FALL;

      if (canReset) triggerResetRef.current?.();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // no deps — uses only refs, immune to stale closures

  /* ── Per-section animation ──────────────────────────────────────────────── */
  const runAnim = useCallback(async (isLast) => {
    if (phase.current !== Phase.SETTLED) return;

    try {
      /* RISING */
      phase.current = Phase.RISING;
      hasCrossedSections.current = true; // mark that ≥1 section has played
      await controls.start({ y: getRiseY(), transition: T.rise });
      await sleep(160);

      /* JUMPING */
      phase.current = Phase.JUMPING;
      await controls.start({ y: getJumpY(), transition: T.jump });

      /* FALLING — flip side */
      phase.current = Phase.FALLING;
      side.current  = side.current === 'right' ? 'left' : 'right';
      const nextX   = side.current === 'right' ? getRightX() : getLeftX();
      await controls.start({ y: 0, x: nextX, transition: T.sectionFall });

      await squish();

      phase.current = isLast ? Phase.FINAL : Phase.SETTLED;
    } catch {
      if (phase.current !== Phase.IDLE) phase.current = Phase.SETTLED;
    }
  }, [controls, squish]);

  /* ── Observer setup — section cards only, no hero observer ─────────────── */
  const setupObservers = useCallback(() => {
    observers.current.forEach((o) => o.disconnect());
    observers.current = [];

    const cards = Array.from(document.querySelectorAll('.sticky-card'));
    if (cards.length < 2) return;

    /* Skip index 0 (hero) — reset is handled by scroll position, not observer */
    const sections = cards.slice(1);

    sections.forEach((card, i) => {
      const isLast = i === sections.length - 1;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && scrollDown.current) {
              runAnim(isLast);
              obs.unobserve(card); // single-fire; re-armed on reset
            }
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
      );

      obs.observe(card);
      observers.current.push(obs);
    });
  }, [runAnim]);

  /* Keep setupRef current */
  useEffect(() => { setupRef.current = setupObservers; }, [setupObservers]);

  /* ── Reveal when loader finishes ────────────────────────────────────────── */
  useEffect(() => {
    if (!loaderDone) return;
    side.current               = 'right';
    hasCrossedSections.current = false;
    phase.current              = Phase.IDLE;
    setVisible(true);
  }, [loaderDone]);

  /* ── Entry fall ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;

    let raf1, raf2;

    const startFall = () => {
      phase.current = Phase.ENTRY_FALL;
      controls
        .start({ y: 0, transition: T.entryFall })
        .then(async () => {
          await squish();
          phase.current = Phase.SETTLED;
          requestAnimationFrame(() => setTimeout(setupObservers, 260));
        });
    };

    raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(startFall); });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Reposition on resize ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const onResize = () => {
      if (phase.current !== Phase.SETTLED && phase.current !== Phase.FINAL) return;
      const x = side.current === 'right' ? getRightX() : getLeftX();
      controls.start({ x, transition: { duration: 0.3, ease: 'easeOut' } });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [visible, controls]);

  /* ── Cleanup ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      observers.current.forEach((o) => o.disconnect());
      controls.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { controls, visible, initX, initY };
}