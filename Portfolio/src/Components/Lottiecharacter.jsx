/**
 * LottieCharacter.jsx — v3
 *
 * Pure rendering shell. All logic lives in useLottieCharacter.
 */

import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLottieCharacter, getSize, FLOOR_GAP } from '../lib/useLottieCharacter';

const LOTTIE_SRC =
  'https://lottie.host/3d7dc9d6-527e-48fc-98ff-710c84840c77/f4RnnXkikm.lottie';

export function LottieCharacter({ loaderDone }) {
  const { controls, visible, initX, initY } = useLottieCharacter(loaderDone);

  if (!visible) return null;

  const sz = getSize();

  return (
    <motion.div
      initial={{ x: initX, y: initY, scaleX: 1, scaleY: 1 }}
      animate={controls}
      style={{
        position:        'fixed',
        bottom:          FLOOR_GAP,
        left:            0,
        width:           sz,
        height:          sz,
        zIndex:          9998,
        pointerEvents:   'none',
        willChange:      'transform',
        transformOrigin: 'bottom center',
      }}
      aria-hidden="true"
    >
      <DotLottieReact
        src={LOTTIE_SRC}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}