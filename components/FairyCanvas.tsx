"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; r: number; vx: number; vy: number;
  phase: number; twinkle: number; ember: boolean; life: number;
}

/** Pre-renders a soft glow sprite once so each frame is just cheap drawImage calls. */
function makeSprite(rgb: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},.75)`);
  grad.addColorStop(0.45, `rgba(${rgb},.18)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Ambient particle field: slow golden fairy-light bokeh that twinkles and drifts, plus warm embers that rise.
 * Pauses when scrolled offscreen or when the tab is hidden. Particles lean away from the cursor.
 */
export default function FairyCanvas({
  className = "", density = 1, embers = 0.35,
}: { className?: string; density?: number; embers?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fairy = makeSprite("255,214,120");
    const ember = makeSprite("255,140,60");

    let w = 0, h = 0, dpr = 1;
    let particles: Particle[] = [];
    let raf = 0, running = false, visible = true;
    const pointer = { x: -9999, y: -9999 };

    const spawn = (initial: boolean): Particle => {
      const isEmber = Math.random() < embers;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: isEmber ? 1.2 + Math.random() * 2 : 1.6 + Math.random() * 3.6,
        vx: (Math.random() - 0.5) * (isEmber ? 0.35 : 0.18),
        vy: isEmber ? -(0.25 + Math.random() * 0.55) : (Math.random() - 0.5) * 0.14,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.6,
        ember: isEmber,
        life: Math.random(),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = Math.min(80, Math.max(16, (w * h) / 16000));
      const count = Math.round(base * density * (w < 640 ? 0.6 : 1));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduce) {
          p.x += p.vx + Math.sin(t * 0.4 * p.twinkle + p.phase) * 0.18;
          p.y += p.vy + Math.cos(t * 0.3 + p.phase) * 0.08;
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400 && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = (1 - d / 120) * 1.2;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push;
          }
        }
        if (p.y < -30 || p.y > h + 40 || p.x < -30 || p.x > w + 30) {
          Object.assign(p, spawn(false));
          if (!p.ember) p.y = Math.random() * h;
        }
        const tw = 0.5 + 0.5 * Math.sin(t * p.twinkle * 1.6 + p.phase);
        // embers fade out as they climb
        const fade = p.ember ? Math.max(0, Math.min(1, p.y / h + 0.15)) : 1;
        ctx.globalAlpha = (p.ember ? 0.35 + tw * 0.55 : 0.25 + tw * 0.75) * fade;
        const s = p.r * (p.ember ? 7 : 9) * (0.85 + tw * 0.3);
        ctx.drawImage(p.ember ? ember : fairy, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });

    if (reduce) draw(0); else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density, embers]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
