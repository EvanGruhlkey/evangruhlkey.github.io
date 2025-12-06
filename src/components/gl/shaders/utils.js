// Shader utility functions

export const periodicNoiseGLSL = /* glsl */ `
  // Periodic noise function using sine and cosine waves
  float periodicNoise(vec3 p, float time) {
    // Create multiple frequency components for more complex movement
    // Using non-integer time multipliers and prime-based frequencies to avoid beat patterns
    float noise = 0.0;
    
    // Primary wave
    noise += sin(p.x * 2.0 + time * 0.7) * cos(p.z * 1.5 + time * 0.7);
    
    // Secondary wave - offset frequency to avoid beat patterns
    noise += sin(p.x * 3.2 + time * 1.3) * cos(p.z * 2.1 + time * 0.9) * 0.6;
    
    // Tertiary wave - prime-based frequency
    noise += sin(p.x * 1.7 + time * 0.5) * cos(p.z * 2.8 + time * 1.1) * 0.4;
    
    // Cross-frequency interaction
    noise += sin(p.x * p.z * 0.5 + time * 0.3) * 0.3;
    
    return noise * 0.3; // Scale down the result
  }
`;



