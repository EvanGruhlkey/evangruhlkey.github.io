import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Particles } from "./particles";

// Detect device capabilities and aggressively favor performance
const getDeviceConfig = () => {
  // Reasonable defaults for SSR
  if (typeof window === "undefined") {
    return {
      size: 256,
      dpr: 1,
      pointSize: 8.0,
    };
  }

  const width = window.innerWidth;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Aggressively reduce particle count for better performance
  // This prevents GC pauses from the large FBO texture
  const size = isMobile ? 96 : isTablet ? 128 : 192;

  // Clamp DPR to keep fill rate under control
  const dpr = isMobile ? 1 : Math.min(devicePixelRatio, 1.5);

  // Larger points on lower particle counts to maintain visual density
  const pointSize = isMobile ? 7.0 : 9.0;

  return {
    size,
    dpr,
    pointSize,
  };
};

export const GL = ({ hovering = false, scrollRef = null }) => {
  const [deviceConfig, setDeviceConfig] = useState(getDeviceConfig);

  useEffect(() => {
    const handleResize = () => {
      setDeviceConfig(getDeviceConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const config = {
    speed: 0.6,
    focus: 3.8,
    aperture: 1.79,
    size: deviceConfig.size,
    noiseScale: 0.3,
    noiseIntensity: 0.35,
    timeScale: 0.6,
    pointSize: deviceConfig.pointSize,
    opacity: 0.8,
    planeScale: 10.0,
    useManualTime: false,
    manualTime: 0,
  };

  return (
    <div id="webgl">
      <Canvas
        dpr={deviceConfig.dpr}
        frameloop="always"
        gl={{
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        performance={{ min: 0.5 }}
        camera={{
          position: [
            1.2629783123314589, 2.664606471394044, -1.8178993743288914,
          ],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
      >
        <color attach="background" args={["#E8E4DC"]} />
        <Particles
          speed={config.speed}
          aperture={config.aperture}
          focus={config.focus}
          size={config.size}
          noiseScale={config.noiseScale}
          noiseIntensity={config.noiseIntensity}
          timeScale={config.timeScale}
          pointSize={config.pointSize}
          opacity={config.opacity}
          planeScale={config.planeScale}
          useManualTime={config.useManualTime}
          manualTime={config.manualTime}
          introspect={hovering}
          scrollRef={scrollRef}
        />
      </Canvas>
    </div>
  );
};
