'use client';
import { useEffect, useRef } from 'react';

/** Slow drifting navy + gold glow behind the hero. Pauses offscreen; static frame for reduced motion. */
export function HeroGlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const blobs = [
      { c: '213,161,60', a: 0.34, r: 0.55, sx: 0.00023, sy: 0.00017, ox: 0.62, oy: 0.42, ax: 0.18, ay: 0.14 },
      { c: '44,66,113', a: 0.9, r: 0.7, sx: 0.00013, sy: 0.00021, ox: 0.3, oy: 0.6, ax: 0.2, ay: 0.16 },
      { c: '231,196,124', a: 0.16, r: 0.35, sx: 0.00031, sy: 0.00027, ox: 0.45, oy: 0.3, ax: 0.25, ay: 0.12 },
    ];
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const m = Math.max(w, h);
      for (const b of blobs) {
        const x = (b.ox + Math.sin(t * b.sx) * b.ax) * w;
        const y = (b.oy + Math.cos(t * b.sy) * b.ay) * h;
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r * m);
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };
    resize();
    if (reduce) draw(4000);
    else raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <>
      <canvas ref={ref} className="glow-canvas" aria-hidden />
      <div className="glow-vignette" aria-hidden />
    </>
  );
}
