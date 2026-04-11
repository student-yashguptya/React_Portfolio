import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

function pseudoNoise(t, i) {
  return new THREE.Vector3(
    Math.sin(t * 1.5 + i * 1.1) * Math.cos(t * 0.8 + i * 0.3),
    Math.cos(t * 1.3 + i * 0.7) * Math.sin(t * 0.9 + i * 1.4),
    Math.sin(t * 1.1 + i * 2.3) * Math.cos(t * 1.2 + i * 0.5)
  );
}

const PARAMS = {
  bloomThreshold: 0.05,
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
  lightIntensity: 1.2,
  sleepTimeScale1: 0.8,
  sleepTimeScale2: 1.6,
};

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

export const GlowingTubeAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Use container dimensions, not window — correct when component isn't full-screen
    let W = container.clientWidth  || window.innerWidth;
    let H = container.clientHeight || window.innerHeight;

    const onAndroid = isAndroid();
    const isMobile  = W < 768;

    // ─── Scene & Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 2000);
    camera.position.set(0, 0, 600);

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
      precision: onAndroid ? "mediump" : "highp",
    });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, onAndroid ? 1.0 : isMobile ? 1.5 : 2)
    );
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ─── ANDROID GLOW FIX ────────────────────────────────────────────────────
    // UnrealBloomPass internally allocates its own half-float render targets.
    // On Android these silently fail → bloom produces nothing.
    // Solution: skip WebGL bloom on Android entirely. Instead apply CSS
    // filter: blur+brightness directly on the <canvas>. This is GPU-composited
    // by the browser itself and works on 100% of Android devices.
    if (onAndroid) {
      const cvs = renderer.domElement;
      cvs.style.filter     = "blur(5px) brightness(4) saturate(1.6)";
      cvs.style.transform  = "scale(1.04) translate3d(0,0,0)"; // hide blur edge fringe
      cvs.style.willChange = "filter, transform";
    }

    // ─── Post-Processing — desktop & iOS only ────────────────────────────────
    let composer = null;

    if (!onAndroid) {
      const gl = renderer.getContext();
      let rtType = THREE.UnsignedByteType;

      if (
        typeof WebGL2RenderingContext !== "undefined" &&
        gl instanceof WebGL2RenderingContext
      ) {
        if (gl.getExtension("EXT_color_buffer_float"))
          rtType = THREE.FloatType;
        else if (gl.getExtension("EXT_color_buffer_half_float"))
          rtType = THREE.HalfFloatType;
      } else {
        if (
          gl.getExtension("OES_texture_half_float") &&
          gl.getExtension("OES_texture_half_float_linear")
        )
          rtType = THREE.HalfFloatType;
        else if (
          gl.getExtension("OES_texture_float") &&
          gl.getExtension("OES_texture_float_linear")
        )
          rtType = THREE.FloatType;
      }

      const renderTarget = new THREE.WebGLRenderTarget(W, H, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: rtType,
      });

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(W, H),
        PARAMS.bloomStrength,
        PARAMS.bloomRadius,
        PARAMS.bloomThreshold
      );

      composer = new EffectComposer(renderer, renderTarget);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(bloomPass);
    }

    // ─── Lights ──────────────────────────────────────────────────────────────
    const dl1 = new THREE.DirectionalLight(0xffffff, PARAMS.lightIntensity * 2);
    dl1.position.set(1, 1, 1);
    scene.add(dl1);

    const dl2 = new THREE.DirectionalLight(0xffffff, PARAMS.lightIntensity * 2);
    dl2.position.set(-1, -1, 1);
    scene.add(dl2);

    scene.add(new THREE.AmbientLight(0xffffff, PARAMS.lightIntensity * 0.5));

    // ─── Tubes & Balls ────────────────────────────────────────────────────────
    const tubes = [];

    PARAMS.colors.forEach((hexColor, colorIdx) => {
      for (let i = 0; i < PARAMS.tubesPerColor; i++) {
        const tubeIdx = colorIdx * PARAMS.tubesPerColor + i;

        // Android: high emissive so CSS blur has bright source material to bloom
        const emissiveIntensity = onAndroid ? 2.2 : 0.45;

        const material = new THREE.MeshStandardMaterial({
          color: hexColor,
          emissive: hexColor,
          emissiveIntensity,
          metalness: PARAMS.metalness,
          roughness: PARAMS.roughness,
        });

        const history = Array.from(
          { length: PARAMS.historySize },
          () => new THREE.Vector3()
        );

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

        // Glowing balls — sphere and icosahedron alternating (unchanged)
        const balls = [];
        for (let b = 0; b < PARAMS.ballsPerTube; b++) {
          const ballGeo =
            (i + b) % 2 === 0
              ? new THREE.SphereGeometry(PARAMS.tubeRadius * 2.5, 12, 12)
              : new THREE.IcosahedronGeometry(PARAMS.tubeRadius * 1.8, 0);

          const ballMat = material.clone();
          ballMat.emissiveIntensity = onAndroid ? 5.0 : 2.5;

          const ballMesh = new THREE.Mesh(ballGeo, ballMat);
          ballMesh.frustumCulled = false;
          scene.add(ballMesh);
          balls.push({
            mesh: ballMesh,
            material: ballMat,
            index: b,
            trailPos: Math.random(),
          });
        }

        tubes.push({
          mesh,
          material,
          history,
          currentPos: new THREE.Vector3(),
          index: tubeIdx,
          balls,
        });
      }
    });

    // ─── Pointer / Touch Tracking ─────────────────────────────────────────────
    const target  = new THREE.Vector3();
    const pointer = new THREE.Vector3();
    let isActive  = false;
    let sleepTimer = null;

    const updatePointer = (e) => {
      isActive = true;
      clearTimeout(sleepTimer);

      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY;
      if (clientX == null || clientY == null) return;

      const rect = container.getBoundingClientRect();
      const x    = ((clientX - rect.left) / rect.width)  * 2 - 1;
      const y    = -((clientY - rect.top)  / rect.height) * 2 + 1;
      pointer.set(x, y, 0.5).unproject(camera);

      const dir      = pointer.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      target.copy(camera.position).add(dir.multiplyScalar(distance));

      sleepTimer = setTimeout(() => { isActive = false; }, 2500);
    };

    window.addEventListener("mousemove",   updatePointer);
    window.addEventListener("pointerdown", updatePointer);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("touchmove",   updatePointer, { passive: true });
    window.addEventListener("touchstart",  updatePointer, { passive: true });

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      W = container.clientWidth  || window.innerWidth;
      H = container.clientHeight || window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer?.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    // ─── Animation Loop ───────────────────────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const vh  = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * 2;
      const vw  = vh * (W / H);
      const mobile = W < 768;

      // Sleep-mode lissajous — tighter radii on mobile to stay within the card
      if (!isActive) {
        const rX = vw * (mobile ? 0.20 : 0.35);
        const rY = vh * (mobile ? 0.12 : 0.25);
        target.x = Math.cos(t * PARAMS.sleepTimeScale1) * rX;
        target.y = Math.sin(t * PARAMS.sleepTimeScale2) * rY;
        target.z = Math.sin(t * 0.5) * (mobile ? 10 : 50);
      }

      // Hard bounds — tubes can never exceed 40% of viewport half-width/height
      const boundX = vw * 0.40;
      const boundY = vh * 0.40;

      // Scale noise down on mobile so it doesn't push tubes off the narrow screen
      const noiseScale = mobile ? PARAMS.noise * 0.4 : PARAMS.noise;

      const dynamicTubeRadius = mobile
        ? PARAMS.tubeRadius * Math.max(0.4, W / 1024)
        : PARAMS.tubeRadius;

      tubes.forEach((tube) => {
        const noise      = pseudoNoise(t, tube.index * 1.5).multiplyScalar(noiseScale);
        const moveTarget = target.clone().add(noise);
        tube.currentPos.lerp(moveTarget, PARAMS.lerp);

        // Clamp so tubes never leave visible card area
        tube.currentPos.x = THREE.MathUtils.clamp(tube.currentPos.x, -boundX, boundX);
        tube.currentPos.y = THREE.MathUtils.clamp(tube.currentPos.y, -boundY, boundY);

        tube.history.shift();
        tube.history.push(tube.currentPos.clone());

        const curve  = new THREE.CatmullRomCurve3(tube.history);
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
          const histIdx = Math.floor(ball.trailPos * (tube.history.length - 1));
          const basePos = tube.history[histIdx] || tube.currentPos;
          const orbitT  = t * (1.5 + bIdx * 0.4) + tube.index * 0.7;
          const orbRad  = dynamicTubeRadius * (4 + bIdx * 2);

          // Clamp ball positions too
          ball.mesh.position.set(
            THREE.MathUtils.clamp(basePos.x + Math.sin(orbitT)       * orbRad, -boundX, boundX),
            THREE.MathUtils.clamp(basePos.y + Math.cos(orbitT * 0.8) * orbRad, -boundY, boundY),
            basePos.z + Math.sin(orbitT * 1.2) * orbRad
          );

          const pulse = 1.0 + Math.sin(t * 5 + bIdx) * 0.2;
          ball.mesh.scale.setScalar((dynamicTubeRadius / PARAMS.tubeRadius) * pulse);

          // Sparkle — identical logic, higher base on Android
          const base = onAndroid ? 4.0 : 2.0;
          const amp  = onAndroid ? 2.0 : 1.5;
          ball.material.emissiveIntensity = base + Math.sin(t * 15 + bIdx) * amp;

          ball.mesh.rotation.x += 0.03;
          ball.mesh.rotation.y += 0.03;
        });
      });

      // Android uses plain renderer; desktop/iOS uses bloom composer
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",   updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("touchmove",   updatePointer);
      window.removeEventListener("touchstart",  updatePointer);
      window.removeEventListener("resize",      onResize);
      clearTimeout(sleepTimer);

      tubes.forEach((tube) => {
        tube.mesh.geometry.dispose();
        tube.material.dispose();
        tube.balls.forEach((ball) => {
          ball.mesh.geometry.dispose();
          ball.material.dispose();
        });
      });

      composer?.dispose();
      renderer.dispose();
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
        position:                 "sticky",
        top:                      0,
        left:                     0,
        width:                    "100%",
        height:                   "100vh",
        pointerEvents:            "none",
        zIndex:                   50,
        mixBlendMode:             "difference",
        overflow:                 "hidden",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility:       "hidden",
        transform:                "translate3d(0,0,0)",
      }}
    />
  );
};