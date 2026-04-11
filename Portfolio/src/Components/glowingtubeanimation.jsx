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
  bloomThreshold: 0.05,   // Lower threshold = glow kicks in earlier on all devices
  bloomStrength: 1.4,
  bloomRadius: 0.9,
  metalness: 0.9,
  roughness: 0.2,
  lerp: 0.1,
  noise: 28.0,
  historySize: 100,
  tubesPerColor: 3,
  ballsPerTube: 10,
  tubeRadius: 1.5,
  tubeSegments: 64,
  tubeRadSegments: 6,
  colors: [
    0x00f0ff, // Cyan
    0xff0055, // Pink/Red
    0x9d00ff, // Purple
    0xffaa00, // Gold
    0x00ff88, // Bright Green
  ],
  lightColors: [0xffffff, 0xffffff, 0xffffff, 0xffffff],
  lightIntensity: 1.2,
  sleepTimeScale1: 0.8,
  sleepTimeScale2: 1.6,
};

// ─── Detect Android ───────────────────────────────────────────────────────────
function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

// ─── Check GPU float texture support ─────────────────────────────────────────
// Returns the best available THREE texture type for render targets.
function getBestRenderTargetType(renderer) {
  const gl = renderer.getContext();

  // WebGL2 path – most modern Android Chrome with WebGL2 supports this
  if (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext) {
    const ext = gl.getExtension("EXT_color_buffer_float");
    if (ext) return THREE.FloatType;
    const extHalf = gl.getExtension("EXT_color_buffer_half_float");
    if (extHalf) return THREE.HalfFloatType;
  }

  // WebGL1 path
  const extHalf = gl.getExtension("OES_texture_half_float");
  const extHalfLinear = gl.getExtension("OES_texture_half_float_linear");
  if (extHalf && extHalfLinear) return THREE.HalfFloatType;

  const extFloat = gl.getExtension("OES_texture_float");
  const extFloatLinear = gl.getExtension("OES_texture_float_linear");
  if (extFloat && extFloatLinear) return THREE.FloatType;

  // Android fallback: 8-bit unsigned – bloom will be dimmer but still rendered
  return THREE.UnsignedByteType;
}

export const GlowingTubeAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const onAndroid = isAndroid();
    const isMobile = W < 768;

    // ─── Scene & Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 2000);
    camera.position.set(0, 0, 600);

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: isMobile ? false : true,
      alpha: false,
      powerPreference: "high-performance",
      // "mediump" helps Android drivers avoid silent precision fallbacks
      precision: onAndroid ? "mediump" : "highp",
    });

    // Cap pixel ratio: Android GPUs easily bottleneck at 3x DPR
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, onAndroid ? 1.0 : isMobile ? 1.5 : 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = onAndroid ? 1.8 : 1.2; // Brighter exposure on Android
    container.appendChild(renderer.domElement);

    // ─── Post-Processing (Bloom) ─────────────────────────────────────────────
    // KEY FIX: Build render target with correct texture type for this device
    const rtType = getBestRenderTargetType(renderer);
    const isLowEndFallback = rtType === THREE.UnsignedByteType;

    const renderTarget = new THREE.WebGLRenderTarget(W, H, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: rtType,
      // Ensure proper color space on Android
      colorSpace: THREE.LinearSRGBColorSpace ?? THREE.LinearEncoding,
    });

    const renderScene = new RenderPass(scene, camera);

    // On Android with no float support, crank bloom params to compensate
    const bloomStrength = isLowEndFallback ? 2.2 : PARAMS.bloomStrength;
    const bloomThreshold = isLowEndFallback ? 0.0 : PARAMS.bloomThreshold;
    const bloomRadius = isLowEndFallback ? 1.2 : PARAMS.bloomRadius;

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(W, H),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // ─── Lights ──────────────────────────────────────────────────────────────
    const dl1 = new THREE.DirectionalLight(PARAMS.lightColors[0], PARAMS.lightIntensity * 2);
    dl1.position.set(1, 1, 1);
    scene.add(dl1);

    const dl2 = new THREE.DirectionalLight(PARAMS.lightColors[1], PARAMS.lightIntensity * 2);
    dl2.position.set(-1, -1, 1);
    scene.add(dl2);

    const amLight = new THREE.AmbientLight(0xffffff, PARAMS.lightIntensity * 0.5);
    scene.add(amLight);

    // ─── Tubes Setup ─────────────────────────────────────────────────────────
    const tubes = [];

    PARAMS.colors.forEach((hexColor, colorIdx) => {
      for (let i = 0; i < PARAMS.tubesPerColor; i++) {
        const tubeIdx = colorIdx * PARAMS.tubesPerColor + i;

        // On devices without float textures, boost emissive so the material
        // itself looks bright even if bloom doesn't accumulate properly.
        const emissiveIntensity = isLowEndFallback ? 1.8 : 0.45;

        const material = new THREE.MeshStandardMaterial({
          color: hexColor,
          emissive: hexColor,
          emissiveIntensity,
          metalness: PARAMS.metalness,
          roughness: PARAMS.roughness,
        });

        const history = [];
        for (let j = 0; j < PARAMS.historySize; j++) {
          history.push(new THREE.Vector3(0, 0, 0));
        }

        const curve = new THREE.CatmullRomCurve3(history);
        const geometry = new THREE.TubeGeometry(
          curve,
          PARAMS.tubeSegments,
          PARAMS.tubeRadius,
          PARAMS.tubeRadSegments,
          false
        );
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        // ─── Glowing Balls ──────────────────────────────────────────────────
        const balls = [];
        for (let b = 0; b < PARAMS.ballsPerTube; b++) {
          const ballGeo =
            (i + b) % 2 === 0
              ? new THREE.SphereGeometry(PARAMS.tubeRadius * 2.5, 12, 12)
              : new THREE.IcosahedronGeometry(PARAMS.tubeRadius * 1.8, 0);

          const ballMaterial = material.clone();
          // Android: make balls very bright to compensate for bloom loss
          ballMaterial.emissiveIntensity = isLowEndFallback ? 4.5 : 2.5;

          const ballMesh = new THREE.Mesh(ballGeo, ballMaterial);
          ballMesh.frustumCulled = false;
          scene.add(ballMesh);
          balls.push({
            mesh: ballMesh,
            material: ballMaterial,
            index: b,
            trailPos: Math.random(),
          });
        }

        tubes.push({
          mesh,
          material,
          history,
          currentPos: new THREE.Vector3(0, 0, 0),
          index: tubeIdx,
          balls,
        });
      }
    });

    // ─── Mouse / Touch Tracking ───────────────────────────────────────────────
    const target = new THREE.Vector3(0, 0, 0);
    const pointer = new THREE.Vector3(0, 0, 0);
    let isActive = false;
    let sleepTimer = null;

    const updatePointer = (e) => {
      isActive = true;
      clearTimeout(sleepTimer);

      const clientX =
        e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      pointer.set(x, y, 0.5).unproject(camera);

      const dir = pointer.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      target.copy(camera.position).add(dir.multiplyScalar(distance));

      sleepTimer = setTimeout(() => {
        isActive = false;
      }, 2500);
    };

    // ── Registered once each (orignal code added touch listeners twice) ──────
    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("pointerdown", updatePointer);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("touchmove", updatePointer, { passive: true });
    window.addEventListener("touchstart", updatePointer, { passive: true });

    // ─── Resize ──────────────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);

      // Resize the render target too – critical on orientation change (Android)
      renderTarget.setSize(W, H);
      bloomPass.setSize(new THREE.Vector2(W, H));
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ───────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const vh =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        camera.position.z *
        2;
      const vw = vh * (W / H);
      const mobile = W < 768;

      if (!isActive) {
        const radiusX = vw * (mobile ? 0.28 : 0.35);
        const radiusY = vh * (mobile ? 0.1 : 0.25);
        target.x = Math.cos(t * PARAMS.sleepTimeScale1) * radiusX;
        target.y = Math.sin(t * PARAMS.sleepTimeScale2) * radiusY;
        target.z = Math.sin(t * 0.5) * (mobile ? 15 : 50);
      }

      const dynamicTubeRadius = mobile
        ? PARAMS.tubeRadius * Math.max(0.4, W / 1024)
        : PARAMS.tubeRadius;

      tubes.forEach((tube) => {
        const noise = pseudoNoise(t, tube.index * 1.5).multiplyScalar(
          PARAMS.noise
        );
        const moveTarget = target.clone().add(noise);
        tube.currentPos.lerp(moveTarget, PARAMS.lerp);

        tube.history.shift();
        tube.history.push(tube.currentPos.clone());

        const curve = new THREE.CatmullRomCurve3(tube.history);
        const newGeo = new THREE.TubeGeometry(
          curve,
          PARAMS.tubeSegments,
          dynamicTubeRadius,
          PARAMS.tubeRadSegments,
          false
        );
        tube.mesh.geometry.dispose();
        tube.mesh.geometry = newGeo;

        tube.balls.forEach((ball, bIdx) => {
          const historyIdx = Math.floor(
            ball.trailPos * (tube.history.length - 1)
          );
          const basePos = tube.history[historyIdx] || tube.currentPos;

          const orbitT = t * (1.5 + bIdx * 0.4) + tube.index * 0.7;
          const radius = dynamicTubeRadius * (4 + bIdx * 2);

          ball.mesh.position.set(
            basePos.x + Math.sin(orbitT) * radius,
            basePos.y + Math.cos(orbitT * 0.8) * radius,
            basePos.z + Math.sin(orbitT * 1.2) * radius
          );

          const pulse = 1.0 + Math.sin(t * 5 + bIdx) * 0.2;
          const scaleRatio = (dynamicTubeRadius / PARAMS.tubeRadius) * pulse;
          ball.mesh.scale.setScalar(scaleRatio);

          // Sparkle – on low-end Android, use a higher base so it's always visible
          const sparkleBase = isLowEndFallback ? 3.5 : 2.0;
          const sparkleAmp = isLowEndFallback ? 2.0 : 1.5;
          ball.material.emissiveIntensity =
            sparkleBase + Math.sin(t * 15 + bIdx) * sparkleAmp;

          ball.mesh.rotation.x += 0.03;
          ball.mesh.rotation.y += 0.03;
        });
      });

      composer.render();
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
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
        tube.balls.forEach((ball) => {
          ball.mesh.geometry.dispose();
          ball.material.dispose();
        });
      });

      renderTarget.dispose();
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
        mixBlendMode: "difference",
        overflow: "hidden",
        filter: "contrast(1.1)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
        opacity: 1,
      }}
    />
  );
};