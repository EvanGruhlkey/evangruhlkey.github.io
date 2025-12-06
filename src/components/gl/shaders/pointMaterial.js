import * as THREE from 'three';
import { periodicNoiseGLSL } from './utils';

export class DofPointsMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
      uniform sampler2D positions;
      uniform sampler2D initialPositions;
      uniform float uTime;
      uniform float uFocus;
      uniform float uFov;
      uniform float uBlur;
      uniform float uPointSize;
      uniform float uPhase;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      varying float vNodeImportance;
      
      // Simple hash function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      void main() { 
        vec3 pos = texture2D(positions, position.xy).xyz;
        vec3 initialPos = texture2D(initialPositions, position.xy).xyz;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        vDistance = abs(uFocus - -mvPosition.z);
        vPosY = pos.y;
        vWorldPosition = pos;
        vInitialPosition = initialPos;
        
        // Determine if this is an "important" node based on position
        float importance = hash(position.xy);
        vNodeImportance = step(0.95, importance); // 5% of nodes are "important"
        
        // Size increases slightly in organized phase
        float sizeMultiplier = 1.0 + (uPhase / 3.0) * 0.3;
        gl_PointSize = max(vDistance * uBlur * uPointSize * sizeMultiplier, 3.0);
      }`,
      fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uRevealFactor;
      uniform float uRevealProgress;
      uniform float uTime;
      uniform float uPhase;
      varying float vDistance;
      varying float vPosY;
      varying vec3 vWorldPosition;
      varying vec3 vInitialPosition;
      varying float vNodeImportance;
      uniform float uTransition;

      ${periodicNoiseGLSL}

      // Sparkle noise function with phase-based behavior
      float sparkleNoise(vec3 seed, float time, float phase) {
        float hash = sin(seed.x * 127.1 + seed.y * 311.7 + seed.z * 74.7) * 43758.5453;
        hash = fract(hash);
        
        // Smoothly interpolate pulse speed based on phase instead of discrete jump
        float phaseNormalized = phase / 3.0;
        float pulseSpeed = mix(1.0, 2.0, smoothstep(0.5, 1.0, phaseNormalized));
        float slowTime = time * pulseSpeed;
        
        float sparkle = 0.0;
        sparkle += sin(slowTime + hash * 6.28318) * 0.5;
        sparkle += sin(slowTime * 1.7 + hash * 12.56636) * 0.3;
        sparkle += sin(slowTime * 0.8 + hash * 18.84954) * 0.2;
        
        float hash2 = sin(seed.x * 113.5 + seed.y * 271.9 + seed.z * 97.3) * 37849.3241;
        hash2 = fract(hash2);
        
        float sparkleMask = sin(hash2 * 6.28318) * 0.7;
        sparkleMask += sin(hash2 * 12.56636) * 0.3;
        
        if (sparkleMask < 0.3) {
          sparkle *= 0.05;
        }
        
        float normalizedSparkle = (sparkle + 1.0) * 0.5;
        float smoothCurve = pow(normalizedSparkle, 4.0);
        float blendFactor = normalizedSparkle * normalizedSparkle;
        float finalBrightness = mix(normalizedSparkle, smoothCurve, blendFactor);
        
        return 0.7 + finalBrightness * 1.3;
      }

      float sdCircle(vec2 p, float r) {
        return length(p) - r;
      }

      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float sdf = sdCircle(cxy, 0.5);
        
        if (sdf > 0.0) discard;

        // Calculate distance from center for reveal effect
        float distanceFromCenter = length(vWorldPosition.xz);
        float noiseValue = periodicNoise(vInitialPosition * 4.0, 0.0);
        float revealThreshold = uRevealFactor + noiseValue * 0.3;
        float revealMask = 1.0 - smoothstep(revealThreshold - 0.2, revealThreshold + 0.1, distanceFromCenter);
        
        // Calculate sparkle brightness
        float sparkleBrightness = sparkleNoise(vInitialPosition, uTime, uPhase);
        
        // Important nodes glow more smoothly as phase increases
        float phaseNormalized = uPhase / 3.0;
        float glowStrength = smoothstep(0.5, 1.0, phaseNormalized);
        float importanceGlow = 1.0 + sin(uTime * 2.0) * 0.4 * (glowStrength * vNodeImportance);
        
        float alpha = (1.04 - clamp(vDistance, 0.0, 1.0)) * 
                      clamp(smoothstep(-0.5, 0.25, vPosY), 0.0, 1.0) * 
                      uOpacity * 
                      revealMask * 
                      uRevealProgress * 
                      sparkleBrightness * 
                      importanceGlow;

        // When transitioning (hovering), keep normal alpha but slightly brighter
        float finalAlpha = mix(alpha, alpha * 1.2, uTransition);
        gl_FragColor = vec4(vec3(0.0), finalAlpha);
      }`,
      uniforms: {
        positions: { value: null },
        initialPositions: { value: null },
        uTime: { value: 0 },
        uFocus: { value: 5.1 },
        uFov: { value: 50 },
        uBlur: { value: 30 },
        uTransition: { value: 0.0 },
        uPointSize: { value: 2.0 },
        uOpacity: { value: 1.0 },
        uRevealFactor: { value: 0.0 },
        uRevealProgress: { value: 0.0 },
        uPhase: { value: 0.0 }
      },
      transparent: true,
      depthWrite: false
    });
  }
}
