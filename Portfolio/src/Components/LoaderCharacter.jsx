import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_URL =
  "https://lottie.host/3d7dc9d6-527e-48fc-98ff-710c84840c77/f4RnnXkikm.lottie";

export const LoaderCharacter = ({ isLoading }) => {
  const controls = useAnimation();
  const ref = useRef(null);

  const [phase, setPhase] = useState("LOADER_PHASE");

  useEffect(() => {
    if (!isLoading) return;

    const runLoaderSequence = async () => {
      const vh = window.innerHeight / 100;
      const centerY = 50 * vh;
      
      const charSize = 150;
      const charHalf = charSize / 2;
      const loaderRadius = 160;
      
      const arcRadius = 195; 
      const startXOffset = 15;
      
      const startYOffset = -Math.sqrt(Math.pow(arcRadius, 2) - Math.pow(startXOffset, 2));
      const collisionY = centerY + startYOffset - charHalf;
      const floorY = (100 * vh) - (20 + 50) - charHalf; 

      // Initialize position above screen slightly offset to right
      controls.set({ y: "-30vh", x: `calc(-50% + ${startXOffset}px)`, opacity: 1 });

      setPhase("FALLING_TO_LOADER");

      // 1. FALL TO LOADER TOP
      await controls.start({
        y: collisionY,
        x: `calc(-50% + ${startXOffset}px)`, 
        transition: {
          type: "spring",
          stiffness: 85,
          damping: 15,
          mass: 1.1
        }
      });

      // 2. COLLISION & SLIDE
      setPhase("SLIDING_BOUNDARY");
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
        transition: { duration: 0.8, ease: "easeOut", times: [0, 1] }
      });

      // 3. FALL TO FLOOR
      setPhase("FALLING_TO_FLOOR");
      await controls.start({
        y: floorY,
        transition: { type: "spring", stiffness: 100, damping: 15, mass: 2.0 }
      });

      // 4. SETTLE & BOUNCE (Very snappy)
      setPhase("SETTLED");
      await controls.start({
        scaleY: [1, 0.8, 1],
        scaleX: [1, 1.2, 1],
        transition: { duration: 0.1, ease: "linear" }
      });


      // 5. EXIT RUN TO RIGHT (Absolute off-screen)
      setPhase("EXIT_RUN");
      // Calculate from the 50% left position. 
      // To reach window.innerWidth from window.innerWidth/2, we need +window.innerWidth/2 + charSize
      const finalX = (window.innerWidth / 2) + charSize;
      
      await controls.start({
        x: finalX,
        opacity: 0,
        transition: {
          duration: 0.7,
          ease: "circIn"
        }
      });
    };

    runLoaderSequence();

    return () => controls.stop();
  }, [isLoading, controls]);

  if (!isLoading) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className="pointer-events-none fixed z-[10000]"
      style={{
        top: 0,
        left: "50%",
        width: "150px",
        height: "150px"
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