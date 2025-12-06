import * as THREE from 'three';
import { periodicNoiseGLSL } from './utils';

export class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(planeScale = 10.0, size = 256) {
    const randomPositions = (() => {
      const length = size * size;
      const data = new Float32Array(length * 4);
      for (let i = 0; i < length; i++) {
        const i4 = i * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = planeScale * (0.5 + Math.random() * 0.5);
        
        data[i4 + 0] = radius * Math.sin(phi) * Math.cos(theta);
        data[i4 + 1] = (Math.random() - 0.5) * planeScale * 0.5;
        data[i4 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        data[i4 + 3] = 1.0;
      }
      const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
      texture.needsUpdate = true;
      return texture;
    })();

    super({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uNoiseScale;
        uniform float uNoiseIntensity;
        uniform float uTimeScale;
        uniform float uScrollProgress;
        uniform float uTransition;
        uniform sampler2D randomPositions;
        varying vec2 vUv;

        ${periodicNoiseGLSL}

        float sdCircle(vec2 p, float r) {
          return length(p) - r;
        }

        float sdQ(vec2 p, float radius) {
          float circle = sdCircle(p, radius);
          
          vec2 tailStart = vec2(radius * 0.4, -radius * 0.4);
          vec2 tailEnd = vec2(radius * 0.9, -radius * 0.9);
          vec2 pa = p - tailStart;
          vec2 ba = tailEnd - tailStart;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          float tailDist = length(pa - ba * h) - radius * 0.15;
          
          return min(circle, tailDist);
        }

        void main() {
          vec3 randomPos = texture2D(randomPositions, vUv).xyz;
          
          vec2 gridPos = (vUv - 0.5) * 15.0;
          
          vec2 qPos = (vUv - 0.5) * 10.0;
          float qDist = sdQ(qPos, 2.8);
          
          float qMask = smoothstep(0.4, 0.0, qDist);
          
          vec2 qNormal = normalize(qPos);
          vec2 qSurfacePos = qPos;
          if (qDist > 0.0) {
            qSurfacePos = qPos - qNormal * qDist;
          }
          
          vec3 qPosition = vec3(qSurfacePos.x, 0.0, qSurfacePos.y);
          
          float qNoise = periodicNoise(vec3(vUv * 3.0, uTime * 0.15), uTime * 0.11);
          qPosition += vec3(qNoise * 0.15);
          
          float t = uTime * uTimeScale;
          vec3 noiseInput = vec3(vUv * uNoiseScale * 0.3, t * 0.1);
          
          // Gentle flowing motion for particles not in Q
          float flowSpeed = t * 0.5;
          vec3 direction = vec3(0.3, 0.0, 0.1);
          
          float wave = sin(vUv.y * 2.0 + t * 0.5) * 0.1;
          
          vec3 smallNoise = vec3(
            periodicNoise(noiseInput + vec3(100.0, 0.0, 0.0), t * 0.29),
            periodicNoise(noiseInput + vec3(0.0, 100.0, 0.0), t * 0.37),
            periodicNoise(noiseInput + vec3(0.0, 0.0, 100.0), t * 0.41)
          ) * 0.15;
          
          vec3 noiseOffset = (direction * flowSpeed + vec3(smallNoise.x, wave, smallNoise.z)) * uNoiseIntensity;
          
          vec3 chaosPos = randomPos + noiseOffset;
          
          vec3 gridPosition = vec3(gridPos.x, 0.0, gridPos.y);
          
          vec3 scrollOrganizedPos = mix(chaosPos, gridPosition, uScrollProgress);
          
          // Always form the Q shape
          vec3 finalPos = mix(scrollOrganizedPos, qPosition, qMask);
          
          // Particles not in Q shape fade to edges smoothly
          float edgeFade = smoothstep(0.0, 0.15, qMask);
          finalPos = mix(
            scrollOrganizedPos * vec3(1.5, 1.0, 1.5),
            finalPos,
            edgeFade
          );
          
          gl_FragColor = vec4(finalPos, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uNoiseScale: { value: 1.0 },
        uNoiseIntensity: { value: 0.5 },
        uTimeScale: { value: 0.5 },
        uScrollProgress: { value: 0 },
        uTransition: { value: 0.0 },
        randomPositions: { value: randomPositions }
      },
    });
  }
}

