import * as THREE from "three";
import { useMemo, useState, useRef, memo } from "react";
import { createPortal, useFrame } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";

import { DofPointsMaterial } from "./shaders/pointMaterial";
import { SimulationMaterial } from "./shaders/simulationMaterial";

export const Particles = memo(function Particles({
  speed,
  aperture,
  focus,
  size = 512,
  noiseScale = 1.0,
  noiseIntensity = 0.5,
  timeScale = 0.5,
  pointSize = 2.0,
  opacity = 1.0,
  planeScale = 1.0,
  useManualTime = false,
  manualTime = 0,
  introspect = false,
  scrollRef = null,
  ...props
}) {
  // Reveal animation state
  const revealStartTime = useRef(null);
  const revealCompleted = useRef(false);
  const [isRevealing, setIsRevealing] = useState(true);
  const revealDuration = 3.5;
  
  // Performance optimization: skip frames for FBO rendering
  const frameCount = useRef(0);
  const skipFrames = 0; // Update FBO every frame for 60 FPS smoothness
  
  // Create simulation material with scale parameter
  const simulationMaterial = useMemo(() => {
    return new SimulationMaterial(planeScale, size);
  }, [planeScale, size]);

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType, // Use half-float to reduce memory pressure and GC pauses
    depth: false,
    stencil: false,
  });

  const dofPointsMaterial = useMemo(() => {
    const m = new DofPointsMaterial();
    m.uniforms.positions.value = target.texture;
    m.uniforms.initialPositions.value =
      simulationMaterial.uniforms.randomPositions.value;
    return m;
  }, [simulationMaterial]);

  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  );
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  useFrame((state, delta) => {
    if (!dofPointsMaterial || !simulationMaterial) return;

    // Clamp delta to prevent large jumps during GC pauses or tab throttling
    // Target 60 FPS = 1/60 = ~0.0166s per frame
    const clampedDelta = Math.min(delta, 1/60 * 2); // Allow up to 2 frames worth

    // Performance optimization: skip frames for expensive FBO rendering
    frameCount.current++;
    const shouldUpdateFBO = frameCount.current % (skipFrames + 1) === 0;

    // Only render to FBO if the materials exist and are ready, and we're on an update frame
    if (shouldUpdateFBO && target && target.texture && scene.children.length > 0) {
      try {
        state.gl.setRenderTarget(target);
        state.gl.clear();
        state.gl.render(scene, camera);
        state.gl.setRenderTarget(null);
      } catch (error) {
        console.error("Error rendering to FBO:", error);
        state.gl.setRenderTarget(null);
        return;
      }
    }

    const currentTime = useManualTime ? manualTime : state.clock.elapsedTime;

    // Read scroll progress from ref (updated outside React render)
    const scrollProgress = scrollRef?.current ?? 0;

    // Initialize reveal start time on first frame
    if (revealStartTime.current === null) {
      revealStartTime.current = currentTime;
    }

    // Calculate reveal progress
    const revealElapsed = currentTime - revealStartTime.current;
    const revealProgress = Math.min(revealElapsed / revealDuration, 1.0);
    const easedProgress = 1 - Math.pow(1 - revealProgress, 3);
    const revealFactor = easedProgress * 4.0;

    // Only trigger state update once (use ref to avoid repeat renders)
    if (revealProgress >= 1.0 && !revealCompleted.current) {
      revealCompleted.current = true;
      setIsRevealing(false);
    }

    // Update simulation material uniforms (only when rendering FBO for performance)
    if (shouldUpdateFBO) {
      simulationMaterial.uniforms.uTime.value = currentTime;
      simulationMaterial.uniforms.uNoiseScale.value = noiseScale;
      simulationMaterial.uniforms.uNoiseIntensity.value = noiseIntensity;
      simulationMaterial.uniforms.uTimeScale.value = timeScale * speed;
    }
    
    // Update point material uniforms (keep time updating for smooth animation)
    dofPointsMaterial.uniforms.uTime.value = currentTime;
    
    // Only update static values on FBO update frames for performance
    if (shouldUpdateFBO) {
      dofPointsMaterial.uniforms.uFocus.value = focus;
      dofPointsMaterial.uniforms.uBlur.value = aperture;
      dofPointsMaterial.uniforms.uPointSize.value = pointSize;
      dofPointsMaterial.uniforms.uOpacity.value = opacity;
    }
    
    dofPointsMaterial.uniforms.uRevealFactor.value = revealFactor;
    dofPointsMaterial.uniforms.uRevealProgress.value = easedProgress;

    // Manually ease scroll progress with frame-independent timing
    if (shouldUpdateFBO) {
      const targetScrollProgress = scrollProgress;
      const currentScrollValue = simulationMaterial.uniforms.uScrollProgress.value;
      const scrollDiff = targetScrollProgress - currentScrollValue;
      const easeSpeed = 2.5; // Faster easing for smoother transitions
      
      if (Math.abs(scrollDiff) > 0.001) {
        const easeAmount = Math.min(easeSpeed * clampedDelta, 1.0);
        simulationMaterial.uniforms.uScrollProgress.value = 
          currentScrollValue + scrollDiff * easeAmount;
      } else {
        simulationMaterial.uniforms.uScrollProgress.value = targetScrollProgress;
      }
    }

    // Manually ease phase uniform
    const targetPhase = scrollProgress * 3;
    const currentPhaseValue = dofPointsMaterial.uniforms.uPhase.value;
    const phaseDiff = targetPhase - currentPhaseValue;
    
    if (Math.abs(phaseDiff) > 0.001) {
      const easeAmount = Math.min(2.5 * clampedDelta, 1.0); // Faster easing for smoother feel
      dofPointsMaterial.uniforms.uPhase.value = 
        currentPhaseValue + phaseDiff * easeAmount;
    } else {
      dofPointsMaterial.uniforms.uPhase.value = targetPhase;
    }

    // Set transition uniforms directly (they should be 1.0)
    simulationMaterial.uniforms.uTransition.value = 1.0;
    dofPointsMaterial.uniforms.uTransition.value = 1.0;
  });

  return (
    <>
      {createPortal(
        <mesh material={simulationMaterial}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points material={dofPointsMaterial} {...props}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
      </points>
    </>
  );
});
