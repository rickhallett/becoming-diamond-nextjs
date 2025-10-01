import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export default function SparklesCore({
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 100,
}: SparklesCoreProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: background,
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: false,
          },
          resize: {
            enable: true,
            delay: 0.5,
          } as any,
        },
      },
      particles: {
        color: {
          value: particleColor,
        },
        move: {
          enable: true,
          speed: speed,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
        number: {
          value: particleDensity,
          density: {
            enable: true,
            width: 400,
            height: 400,
          },
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1,
          },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            startValue: "random",
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: minSize,
            max: maxSize,
          },
        },
      },
      detectRetina: true,
    }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  );

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={id}
      className={className}
      options={options}
    />
  );
}
