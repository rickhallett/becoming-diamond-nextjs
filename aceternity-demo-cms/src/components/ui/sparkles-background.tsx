"use client";
import React, { useEffect, useRef } from "react";

export function SparklesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            fadeSpeed: number;
        }> = [];

        const particleCount = 100;

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random(),
                fadeSpeed: Math.random() * 0.02 + 0.005,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Update opacity for twinkling effect
                particle.opacity += particle.fadeSpeed;
                if (particle.opacity > 1) {
                    particle.opacity = 1;
                    particle.fadeSpeed = -particle.fadeSpeed;
                }
                if (particle.opacity < 0) {
                    particle.opacity = 0;
                    particle.fadeSpeed = -particle.fadeSpeed;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(79, 195, 247, ${particle.opacity * 0.8})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#4FC3F7";
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            style={{
                pointerEvents: "none",
            }}
        />
    );
}