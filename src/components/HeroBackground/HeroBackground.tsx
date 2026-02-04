"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas particle network background for the hero section.
 * Repurposed from LoginBackground; no MUI dependency.
 * Dark theme colors tuned for portfolio (editor-style).
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = wrapper.clientWidth);
    let height = (canvas.height = wrapper.clientHeight);

    // Site accent green (editor.component #4AC693)
    const particleColors = ["#4AC693"];
    const lineColor = "74, 206, 147";

    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const connectionDistance = 125;
    const mouseDistance = 100;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      pingLife: number;
      maxPingSize: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.size = Math.random() * 2 + 1;
        this.color =
          particleColors[Math.floor(Math.random() * particleColors.length)];
        this.pingLife = 0;
        this.maxPingSize = Math.random() * 20 + 20;
      }

      update(mouseX?: number, mouseY?: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 1.5;
            const directionY = forceDirectionY * force * 1.5;
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        if (this.pingLife > 0) {
          this.pingLife -= 0.004;
        } else if (Math.random() < 0.004) {
          this.pingLife = 1;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.pingLife > 0) {
          ctx.beginPath();
          const pingRadius =
            this.size + (1 - this.pingLife) * this.maxPingSize;
          ctx.arc(this.x, this.y, pingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = this.color;
          ctx.globalAlpha = this.pingLife * 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }

    let particles: Particle[] = [];
    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let mouseX: number | undefined;
    let mouseY: number | undefined;
    let animationFrameId: number | undefined;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        if (mouseX !== undefined && mouseY !== undefined) {
          const dx = p1.x - mouseX;
          const dy = p1.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      });

      particles.forEach((p) => {
        p.update(mouseX, mouseY);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = wrapper.clientWidth;
      height = canvas.height = wrapper.clientHeight;
      init();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(wrapper);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = undefined;
      mouseY = undefined;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    init();
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-60"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
