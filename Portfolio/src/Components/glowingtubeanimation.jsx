import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// ─── Custom Pseudo-Noise ──────────────────────────────────────────────────────
function pseudoNoise(t, i) {
  return new THREE.Vector3(
    Math.sin(t * 1.5 + i * 1.1) * Math.cos(t * 0.8 + i * 0.3),
    Math.cos(t * 1.3 + i * 0.7) * Math.sin(t * 0.9 + i * 1.4),
    Math.sin(t * 1.1 + i * 2.3) * Math.cos(t * 1.2 + i * 0.5)
  );
}

// ─── Configuration ────────────────────────────────────────────────────────────
const PARAMS = {
  bloomThreshold: 0.1,
  bloomStrength: 1.0,  // Reduced from 1.2
  bloomRadius: 0.8,
  metalness: 0.9,
  roughness: 0.2,
  lerp: 0.1,         // How fast tubes follow
  noise: 28.0,       // Slightly increased spread
  historySize: 100,   // Increased from 50 for longer tubes
  tubesPerColor: 2,  // 3 tubes for each color
  ballsPerTube: 5,  // Increased further to cover the entire length
  tubeRadius: 1.5,   // Thinned slightly for density
  tubeSegments: 64,
  tubeRadSegments: 6,
  colors: [
    0x00f0ff, // Cyan
    0xff0055, // Pink/Red
    0x9d00ff, // Purple
    0xffaa00, // Gold
    0x00ff88  // Bright Green
  ],
  lightColors: [0xffffff, 0xffffff, 0xffffff, 0xffffff],
  lightIntensity: 1.2,
  sleepTimeScale1: 0.8,
  sleepTimeScale2: 1.6, // 2x = Infinity sign / Lissajous figure
};

export const GlowingTubeAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // ─── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    
    // Using a pure black background allows screen/additive blending in CSS perfectly.
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 2000);
    camera.position.set(0, 0, 600);

    const isMobile = W < 768;

    // ─── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: isMobile ? false : true, // Disable antialias on mobile for performance/glow stability
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)); // Cap mobile resolution for GPU stability
    renderer.setSize(W, H);
    
    // Tone mapping helps bloom consistency across devices
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    container.appendChild(renderer.domElement);

    // ─── Post-Processing (Bloom) ───────────────────────────────────────────────
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(W, H),
      PARAMS.bloomStrength,
      PARAMS.bloomRadius,
      PARAMS.bloomThreshold
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // ─── Lights ────────────────────────────────────────────────────────────────
    const dl1 = new THREE.DirectionalLight(PARAMS.lightColors[0], PARAMS.lightIntensity * 2);
    dl1.position.set(1, 1, 1);
    scene.add(dl1);

    const dl2 = new THREE.DirectionalLight(PARAMS.lightColors[1], PARAMS.lightIntensity * 2);
    dl2.position.set(-1, -1, 1);
    scene.add(dl2);

    const amLight = new THREE.AmbientLight(0xffffff, PARAMS.lightIntensity * 0.5);
    scene.add(amLight);

    // ─── Tubes Setup ───────────────────────────────────────────────────────────
    const tubes = [];
    
    PARAMS.colors.forEach((hexColor, colorIdx) => {
      for (let i = 0; i < PARAMS.tubesPerColor; i++) {
        const tubeIdx = colorIdx * PARAMS.tubesPerColor + i;
        
        // Physical material matching the "Metalness / Roughness" requirement
        const material = new THREE.MeshStandardMaterial({
          color: hexColor,
          emissive: hexColor,
          emissiveIntensity: 0.45, // Reduced from 0.8 for a softer look
          metalness: PARAMS.metalness,
          roughness: PARAMS.roughness,
        });

        // Initial history is just points at the center
        const history = [];
        for (let j = 0; j < PARAMS.historySize; j++) {
          history.push(new THREE.Vector3(0, 0, 0));
        }

        // Initial curve
        const curve = new THREE.CatmullRomCurve3(history);
        const geometry = new THREE.TubeGeometry(curve, PARAMS.tubeSegments, PARAMS.tubeRadius, PARAMS.tubeRadSegments, false);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Prevent frustum culling from glitching as bounding spheres move rapidly
        mesh.frustumCulled = false; 

        scene.add(mesh);

        // ─── Glowing Balls Setup ──────────────────────────────────────────────
        const balls = [];
        for (let b = 0; b < PARAMS.ballsPerTube; b++) {
          const ballGeo = (i + b) % 2 === 0 
            ? new THREE.SphereGeometry(PARAMS.tubeRadius * 2.5, 12, 12)
            : new THREE.IcosahedronGeometry(PARAMS.tubeRadius * 1.8, 0); // Geometric shapes sparkle better
          
          // Clone material so each ball can "sparkle" independently
          const ballMaterial = material.clone();
          ballMaterial.emissiveIntensity = 2.5; // High base brightness for bloom
          
          const ballMesh = new THREE.Mesh(ballGeo, ballMaterial);
          ballMesh.frustumCulled = false;
          scene.add(ballMesh);
          balls.push({
            mesh: ballMesh,
            material: ballMaterial,
            index: b,
            trailPos: Math.random() // Distribute along the trail
          });
        }

        tubes.push({
          mesh,
          material,
          history,
          currentPos: new THREE.Vector3(0, 0, 0),
          index: tubeIdx,
          balls
        });
      }
    });

    // ─── Mouse Tracking & Sleep State ──────────────────────────────────────────
    const target = new THREE.Vector3(0, 0, 0);
    const pointer = new THREE.Vector3(0, 0, 0);
    let isActive = false;
    let sleepTimer = null;

    const updatePointer = (e) => {
      isActive = true;
      clearTimeout(sleepTimer);
      
      // Determine coordinates from either mouse or touch event
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      pointer.set(x, y, 0.5).unproject(camera);

      const dir = pointer.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      target.copy(camera.position).add(dir.multiplyScalar(distance));

      // After 2.5 seconds of no movement, activate sleep mode
      sleepTimer = setTimeout(() => {
        isActive = false;
      }, 2500);
    };

    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("pointerdown", updatePointer);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("touchmove", updatePointer, { passive: true });
    window.addEventListener("touchstart", updatePointer, { passive: true });

    // ─── Resize Handling ───────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);
      bloomPass.setSize(new THREE.Vector2(W, H));
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ────────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Calculate Viewport Dimensions at Z=0 for Sleep Mode relative scaling
      const vh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * 2;
      const vw = vh * (W / H);
      const isMobile = W < 768;

      // Map Sleep Mode Infinity Curve
      if (!isActive) {
        // Tightened mobile radii to keep animation centered within cards
        const radiusX = vw * (isMobile ? 0.32 : 0.35); 
        const radiusY = vh * (isMobile ? 0.12 : 0.25); 
        
        target.x = Math.cos(t * PARAMS.sleepTimeScale1) * radiusX;
        target.y = Math.sin(t * PARAMS.sleepTimeScale2) * radiusY;
        target.z = Math.sin(t * 0.5) * (isMobile ? 20 : 50); // Reduced depth variance on mobile
      }

      // Dynamic physical radius so it looks identically elegant on desktop and mobile
      // (On mobile screens, 1.8 units is massively thick, so we scale it down relative to width)
      const dynamicTubeRadius = isMobile 
                                ? PARAMS.tubeRadius * Math.max(0.4, (W / 1024))
                                : PARAMS.tubeRadius;

      // Update Tubes
      tubes.forEach((tube) => {
        // Individual noise calculation gives each strand a separate organic wiggle
        // We add a slight offset per tube index within color group for better separation
        const noise = pseudoNoise(t, tube.index * 1.5).multiplyScalar(PARAMS.noise);
        
        // Desired target + noise offset
        const moveTarget = target.clone().add(noise);

        // Lerp current head position towards the target
        tube.currentPos.lerp(moveTarget, PARAMS.lerp);

        // Update tail array: Shift history array down (latest pos gets placed at end)
        tube.history.shift();
        tube.history.push(tube.currentPos.clone());

        // Rebuild TubeGeometry (Very fast at low segments, perfectly fluid over time)
        const curve = new THREE.CatmullRomCurve3(tube.history);
        const newGeo = new THREE.TubeGeometry(curve, PARAMS.tubeSegments, dynamicTubeRadius, PARAMS.tubeRadSegments, false);
        
        tube.mesh.geometry.dispose();
        tube.mesh.geometry = newGeo;

        // Update Balls spread along the tube trail
        tube.balls.forEach((ball, bIdx) => {
          // Identify which point in history to follow based on trailPos
          const historyIdx = Math.floor(ball.trailPos * (tube.history.length - 1));
          const basePos = tube.history[historyIdx] || tube.currentPos;

          const orbitT = t * (1.5 + bIdx * 0.4) + (tube.index * 0.7);
          const radius = dynamicTubeRadius * (4 + bIdx * 2); // Orbit the trail
          
          ball.mesh.position.set(
            basePos.x + Math.sin(orbitT) * radius,
            basePos.y + Math.cos(orbitT * 0.8) * radius,
            basePos.z + Math.sin(orbitT * 1.2) * radius
          );
          
          // Match ball scale to dynamic tube thickness & add a pulse
          const pulse = 1.0 + Math.sin(t * 5 + bIdx) * 0.2;
          const scaleRatio = (dynamicTubeRadius / PARAMS.tubeRadius) * pulse;
          ball.mesh.scale.setScalar(scaleRatio);

          // Sparkle Effect
          ball.material.emissiveIntensity = 2.0 + Math.sin(t * 15 + bIdx) * 1.5;

          ball.mesh.rotation.x += 0.03;
          ball.mesh.rotation.y += 0.03;
        });
      });

      // Render via Composer
      composer.render();
    };

    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("touchmove", updatePointer);
      window.removeEventListener("touchstart", updatePointer);
      window.removeEventListener("resize", onResize);
      clearTimeout(sleepTimer);

      tubes.forEach((tube) => {
        tube.mesh.geometry.dispose();
        tube.material.dispose();
        tube.balls.forEach(ball => {
          ball.mesh.geometry.dispose();
          ball.material.dispose();
        });
      });
      
      renderer.dispose();
      composer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="glowing-tubes-cursor"
      aria-hidden="true"
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 50,
        mixBlendMode: "difference", // Using difference guarantees automatic text contrast adaptation
        overflow: "hidden",
        filter: "contrast(1.1)", // Slight contrast boost for mobile glow visibility
        WebkitBackfaceVisibility: "hidden", // Performance optimizations for mobile browsers
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
      }}
    />
  );
};
