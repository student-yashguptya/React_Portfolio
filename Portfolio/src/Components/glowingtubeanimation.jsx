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
  bloomStrength: 1.2,
  bloomRadius: 0.8,
  metalness: 0.9,
  roughness: 0.2,
  lerp: 0.1,         // How fast tubes follow
  noise: 25.0,       // Noise scale displacement
  historySize: 50,   // Length of the tail
  tubeRadius: 1.8,
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

    // ─── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false, // Must be false for UnrealBloomPass to composite correctly
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
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
    
    PARAMS.colors.forEach((hexColor, index) => {
      // Physical material matching the "Metalness / Roughness" requirement
      const material = new THREE.MeshStandardMaterial({
        color: hexColor,
        emissive: hexColor,
        emissiveIntensity: 0.8, // makes it glow brightly into the bloom pass
        metalness: PARAMS.metalness,
        roughness: PARAMS.roughness,
      });

      // Initial history is just points at the center
      const history = [];
      for (let i = 0; i < PARAMS.historySize; i++) {
        history.push(new THREE.Vector3(0, 0, 0));
      }

      // Initial curve
      const curve = new THREE.CatmullRomCurve3(history);
      const geometry = new THREE.TubeGeometry(curve, PARAMS.tubeSegments, PARAMS.tubeRadius, PARAMS.tubeRadSegments, false);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Prevent frustum culling from glitching as bounding spheres move rapidly
      mesh.frustumCulled = false; 

      scene.add(mesh);

      tubes.push({
        mesh,
        material,
        history,
        currentPos: new THREE.Vector3(0, 0, 0),
        index
      });
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
        const radiusX = vw * (isMobile ? 0.45 : 0.35); // Expand width usage on mobile 
        const radiusY = vh * (isMobile ? 0.15 : 0.25); // Condense height on mobile
        
        target.x = Math.cos(t * PARAMS.sleepTimeScale1) * radiusX;
        target.y = Math.sin(t * PARAMS.sleepTimeScale2) * radiusY;
        target.z = Math.sin(t * 0.5) * 50; // Give it a gentle depth weave
      }

      // Dynamic physical radius so it looks identically elegant on desktop and mobile
      // (On mobile screens, 1.8 units is massively thick, so we scale it down relative to width)
      const dynamicTubeRadius = isMobile 
                                ? PARAMS.tubeRadius * Math.max(0.4, (W / 1024))
                                : PARAMS.tubeRadius;

      // Update Tubes
      tubes.forEach((tube) => {
        // Individual noise calculation gives each strand a separate organic wiggle
        const noise = pseudoNoise(t, tube.index).multiplyScalar(PARAMS.noise);
        
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
      }}
    />
  );
};
