import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_URL =
  "https://lottie.host/3d7dc9d6-527e-48fc-98ff-710c84840c77/f4RnnXkikm.lottie";

export const LoaderCharacter = ({ isLoading }) => {
  const controls = useAnimation();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isLoading || hasStarted.current) return;
    
    // Mark as started to prevent re-triggers during the same load
    hasStarted.current = true;

    const runLoaderSequence = async () => {
      // Capture stable dimensions at start
      const W = window.innerWidth;
      const H = window.innerHeight;
      const isMobile = W < 640;
      const centerY = H / 2;
      
      const charSize = isMobile ? 104 : 150;
      const charHalf = charSize / 2;
      
      const arcRadius = isMobile ? 122 : 195; 
      const startXOffset = isMobile ? 10 : 15;
      
      const startYOffset = -Math.sqrt(Math.pow(arcRadius, 2) - Math.pow(startXOffset, 2));
      const collisionY = centerY + startYOffset - charHalf;
      const floorY = H - (20 + (isMobile ? 30 : 50)) - charHalf; 

      // Wait a tiny bit for the browser to settle and Lottie to initialize
      await new Promise(r => setTimeout(r, 100));

      // Initial State
      controls.set({ 
        y: -H * 0.4, // Fall from 40% above the screen
        x: `calc(-50% + ${startXOffset}px)`, 
        opacity: 0,
        width: charSize,
        height: charSize,
        scale: 1
      });

      // 0. Fade in while invisible above
      await controls.start({ opacity: 1, transition: { duration: 0.2 } });

      // 1. FALL TO LOADER TOP
      await controls.start({
        y: collisionY,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 18,
          mass: 1.2
        }
      });

      // 2. COLLISION & SLIDE (Consistent Arc)
      // We use a multi-stage slide to ensure it follows the curve of the loader
      await controls.start({
        x: [
          `calc(-50% + ${startXOffset}px)`, 
          `calc(-50% + ${arcRadius * 0.707}px)`, 
          `calc(-50% + ${arcRadius}px)`
        ],
        y: [
          collisionY, 
          centerY - (arcRadius * 0.707) - charHalf, 
          centerY - charHalf
        ],
        transition: { 
          duration: 0.75, 
          ease: "easeOut",
          times: [0, 0.6, 1] 
        }
      });

      // 3. FALL TO FLOOR
      await controls.start({
        y: floorY,
        transition: { 
          type: "spring", 
          stiffness: 120, 
          damping: 14, 
          mass: 1.8 
        }
      });

      // 4. SNAPPY LANDING BOUNCE
      await controls.start({
        scaleY: [1, 0.85, 1],
        scaleX: [1, 1.15, 1],
        transition: { duration: 0.15, ease: "easeOut" }
      });

      // 5. EXIT RUN TO RIGHT (Smoothly off-screen)
      const finalXPos = (W / 2) + charSize + 100;
      
      await controls.start({
        x: finalXPos,
        opacity: [1, 1, 0], // Stay visible then fade at the very end
        transition: {
          duration: 0.8,
          ease: [0.45, 0, 0.55, 1], // Custom cubic-bezier for a 'running start' feel
          times: [0, 0.7, 1]
        }
      });
    };

    runLoaderSequence();

    return () => {
      controls.stop();
      // Reset ref only if we want it to run again on subsequent loads
      // For a single session, we might want to keep it true.
    };
  }, [isLoading, controls]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      className="pointer-events-none fixed z-[10000]"
      style={{
        top: 0,
        left: "50%",
      }}
    >
      <DotLottieReact
        src={LOTTIE_URL}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </motion.div>
  );
};