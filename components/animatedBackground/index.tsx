"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    p5: any;
  }
}

export function AnimatedBackground() {
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
          let gridSize = 25; // Aumentado para menos puntos
          let cols: number;
          let rows: number;
          let frameCount = 0;

          p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.frameRate(30); // Reducir FPS para mejor rendimiento

            // Ajustar gridSize basado en el tamaño de pantalla
            if (p.width < 768) {
              gridSize = 35; // Móviles: muchos menos puntos
            } else if (p.width < 1200) {
              gridSize = 30; // Tablets: menos puntos
            } else {
              gridSize = 25; // Desktop: puntos normales
            }

            cols = Math.ceil(p.width / gridSize) + 3; // Reducido buffer
            rows = Math.ceil(p.height / gridSize) + 3;

            // Initialize dots grid
            for (let x = 0; x < cols; x++) {
              dots[x] = [];
              for (let y = 0; y < rows; y++) {
                dots[x][y] = {
                  x: x * gridSize,
                  y: y * gridSize,
                  alpha: 0,
                  size: 0,
                  lastAlpha: 0,
                };
              }
            }
          };

          p.draw = () => {
            frameCount++;

            // Skip frames on mobile for better performance
            if (p.width < 768 && frameCount % 2 === 0) {
              return;
            }

            // Background color #141414
            p.background(20, 20, 20);

            // Pre-calculate wave parameters
            const waveSpeed = 0.06; // Slightly slower
            const waveFrequency = 0.01; // Reduced frequency
            const waveAmplitude = 6; // Reduced amplitude
            const timeOffset = time * waveSpeed;
            const maxMouseInfluence = 80; // Smaller influence area

            // Calculate screen diagonal once
            const screenDiagonal = p.dist(0, 0, p.width, p.height);

            // Batch processing - only update visible dots
            const visibleDots = [];
            for (let x = 0; x < cols; x++) {
              for (let y = 0; y < rows; y++) {
                const dot = dots[x][y];

                // Skip dots that are far off screen
                if (
                  dot.x < -gridSize * 2 ||
                  dot.x > p.width + gridSize * 2 ||
                  dot.y < -gridSize * 2 ||
                  dot.y > p.height + gridSize * 2
                ) {
                  continue;
                }

                visibleDots.push({ dot, x, y });
              }
            }

            // Process visible dots
            for (const { dot } of visibleDots) {
              // Calculate distance from bottom-right corner (cached)
              const distanceFromCorner = p.dist(
                dot.x,
                dot.y,
                p.width,
                p.height
              );

              // Simplified wave effect (only one wave)
              const waveOffset = (dot.x + dot.y) * waveFrequency - timeOffset;
              const wave = p.sin(waveOffset) * waveAmplitude;

              // Calculate alpha based on wave and distance
              const baseAlpha = p.map(
                wave,
                -waveAmplitude,
                waveAmplitude,
                0,
                180
              ); // Reduced max alpha

              // Distance-based fading (optimized)
              const distanceFactor = p.map(
                distanceFromCorner,
                0,
                screenDiagonal,
                0.8,
                0.1
              );

              // Simplified trailing effect
              const trailOffset = (dot.x + dot.y) * 0.003 - time * 0.08;
              const trailFactor = p.map(p.sin(trailOffset), -1, 1, 0.5, 1);

              const finalAlpha = baseAlpha * distanceFactor * trailFactor;

              // Smooth alpha transitions
              dot.alpha = p.lerp(
                dot.lastAlpha,
                p.constrain(finalAlpha, 0, 255),
                0.1
              );
              dot.lastAlpha = dot.alpha;

              // Size variation (simplified)
              dot.size = p.map(dot.alpha, 0, 255, 1, 3);

              // Draw dot if visible (higher threshold)
              if (dot.alpha > 15) {
                p.fill(255, dot.alpha);
                p.noStroke();
                p.ellipse(dot.x, dot.y, dot.size);

                // Simplified glow (only for very bright dots)
                if (dot.alpha > 180) {
                  p.fill(255, dot.alpha * 0.15);
                  p.ellipse(dot.x, dot.y, dot.size * 1.5);
                }
              }
            }

            // Reduced floating particles (only on desktop)
            if (p.width >= 768) {
              p.fill(255, 60);
              p.noStroke();
              for (let i = 0; i < 5; i++) {
                // Reduced from 10 to 5
                const particleX =
                  p.width - ((time * 1.2 + i * 80) % (p.width + 100));
                const particleY =
                  p.height - ((time * 0.8 + i * 60) % (p.height + 100));
                const particleAlpha = p.map(
                  p.sin(time * 0.02 + i),
                  -1,
                  1,
                  30,
                  100
                );

                p.fill(255, particleAlpha);
                p.ellipse(particleX, particleY, 1.2);
              }
            }

            time += 0.8; // Slower time increment
          };

          p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);

            // Adjust grid size based on screen size
            if (p.width < 768) {
              gridSize = 35;
            } else if (p.width < 1200) {
              gridSize = 30;
            } else {
              gridSize = 25;
            }

            cols = Math.ceil(p.width / gridSize) + 3;
            rows = Math.ceil(p.height / gridSize) + 3;

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
                  lastAlpha: 0,
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
      ref={sketchRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ backgroundColor: "#141414" }}
    />
  );
}
