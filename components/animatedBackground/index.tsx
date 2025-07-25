"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    p5: any;
  }
}

export default function AnimatedBackground() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load p5.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js";
    script.async = true;

    script.onload = () => {
      if (window.p5 && sketchRef.current) {
        const sketch = (p: any) => {
          let time = 0;
          const dots: any[] = [];
          const gridSize = 15;
          let cols: number;
          let rows: number;

          p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            cols = Math.ceil(p.width / gridSize) + 10;
            rows = Math.ceil(p.height / gridSize) + 10;

            // Initialize dots grid
            for (let x = 0; x < cols; x++) {
              dots[x] = [];
              for (let y = 0; y < rows; y++) {
                dots[x][y] = {
                  x: x * gridSize,
                  y: y * gridSize,
                  alpha: 0,
                  size: 0,
                };
              }
            }
          };

          p.draw = () => {
            // Background color #141414
            p.background(20, 20, 20);

            // Calculate wave parameters
            const waveSpeed = 0.08;
            const waveFrequency = 0.008;
            const waveAmplitude = 8;

            // Update and draw dots
            for (let x = 0; x < cols; x++) {
              for (let y = 0; y < rows; y++) {
                const dot = dots[x][y];

                // Calculate distance from bottom-right corner
                const distanceFromCorner = p.dist(
                  dot.x,
                  dot.y,
                  p.width,
                  p.height
                );

                // Create wave effect moving from bottom-right to top-left
                const waveOffset =
                  (dot.x + dot.y) * waveFrequency - time * waveSpeed;
                const wave1 = p.sin(waveOffset) * waveAmplitude;
                const wave2 =
                  p.sin(waveOffset * 1.5 + time * 0.04) * waveAmplitude * 0.5;
                const wave3 =
                  p.sin(waveOffset * 0.7 + time * 0.06) * waveAmplitude * 0.3;

                const combinedWave = wave1 + wave2 + wave3;

                // Calculate alpha based on wave and distance
                const baseAlpha = p.map(
                  combinedWave,
                  -waveAmplitude * 2,
                  waveAmplitude * 2,
                  0,
                  255
                );

                // Add distance-based fading (closer to bottom-right = more visible)
                const distanceFactor = p.map(
                  distanceFromCorner,
                  0,
                  p.dist(0, 0, p.width, p.height),
                  1,
                  0.1
                );

                // Create trailing effect
                const trailOffset = (dot.x + dot.y) * 0.005 - time * 0.12;
                const trailFactor = p.map(p.sin(trailOffset), -1, 1, 0.3, 1);

                dot.alpha = p.constrain(
                  baseAlpha * distanceFactor * trailFactor,
                  0,
                  255
                );

                // Size variation based on alpha
                dot.size = p.map(dot.alpha, 0, 255, 0.5, 4);

                // Draw dot if visible
                if (dot.alpha > 5) {
                  p.fill(255, dot.alpha);
                  p.noStroke();
                  p.ellipse(dot.x, dot.y, dot.size);

                  // Add subtle glow for brighter dots
                  if (dot.alpha > 150) {
                    p.fill(255, dot.alpha * 0.3);
                    p.ellipse(dot.x, dot.y, dot.size * 2);
                  }
                }
              }
            }

            // Add some floating particles for extra movement
            p.fill(255, 100);
            p.noStroke();
            for (let i = 0; i < 20; i++) {
              const particleX =
                p.width - ((time * 2 + i * 50) % (p.width + 100));
              const particleY =
                p.height - ((time * 1.2 + i * 30) % (p.height + 100));
              const particleAlpha = p.map(
                p.sin(time * 0.04 + i),
                -1,
                1,
                50,
                150
              );

              p.fill(255, particleAlpha);
              p.ellipse(particleX, particleY, 2);
            }

            time++;
          };

          p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
            cols = Math.ceil(p.width / gridSize) + 10;
            rows = Math.ceil(p.height / gridSize) + 10;

            // Reinitialize dots grid
            dots.length = 0;
            for (let x = 0; x < cols; x++) {
              dots[x] = [];
              for (let y = 0; y < rows; y++) {
                dots[x][y] = {
                  x: x * gridSize,
                  y: y * gridSize,
                  alpha: 0,
                  size: 0,
                };
              }
            }
          };
        };

        // Create p5 instance
        p5InstanceRef.current = new window.p5(sketch, sketchRef.current);
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      className="fixed z-10 w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#141414" }}
    >
      <div ref={sketchRef} className="absolute inset-0" />
    </div>
  );
}
