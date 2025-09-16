'use client';

import React, { useRef, useEffect, useCallback } from 'react';

// Self-contained easing functions, removing the need for the 'easing-utils' package.
const easing = {
    linear: (t: number) => t,
    inExpo: (t: number) => Math.pow(2, 10 * (t - 1)),
};

export function DeepHoleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  // Using refs for animation state to avoid re-renders on every tick
  const state = useRef<{
    ctx: CanvasRenderingContext2D | null;
    rect: DOMRect | null;
    render: { width: number; height: number; dpi: number };
    discs: any[];
    lines: any[];
    particles: any[];
    startDisc: any;
    endDisc: any;
    clip: { disc?: any; i?: number; path?: Path2D };
    particleArea: any;
    linesCanvas: OffscreenCanvas | null;
    linesCtx: OffscreenCanvasRenderingContext2D | null;
  }>({
    ctx: null,
    rect: null,
    render: { width: 0, height: 0, dpi: 1 },
    discs: [],
    lines: [],
    particles: [],
    startDisc: {},
    endDisc: {},
    clip: {},
    particleArea: {},
    linesCanvas: null,
    linesCtx: null,
  });

  const tweenValue = (start: number, end: number, p: number, ease?: keyof typeof easing) => {
    const delta = end - start;
    const easeFn = ease ? easing[ease] : easing.linear;
    return start + delta * easeFn(p);
  };
  
  const tweenDisc = useCallback((disc: any) => {
    const s = state.current;
    disc.x = tweenValue(s.startDisc.x, s.endDisc.x, disc.p);
    disc.y = tweenValue(s.startDisc.y, s.endDisc.y, disc.p, 'inExpo');
    disc.w = tweenValue(s.startDisc.w, s.endDisc.w, disc.p);
    disc.h = tweenValue(s.startDisc.h, s.endDisc.h, disc.p);
    return disc;
  }, []);

  const initParticle = useCallback((start = false) => {
    const s = state.current;
    const sx = s.particleArea.sx + s.particleArea.sw * Math.random();
    const ex = s.particleArea.ex + s.particleArea.ew * Math.random();
    const dx = ex - sx;
    const y = start ? s.particleArea.h * Math.random() : s.particleArea.h;
    const r = 0.5 + Math.random() * 4;
    const vy = 0.5 + Math.random();

    return {
      x: sx, sx, dx, y, vy, p: 0, r, c: `rgba(255, 255, 255, ${Math.random()})`
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const s = state.current;

    s.rect = containerRef.current.getBoundingClientRect();
    s.render = {
      width: s.rect.width,
      height: s.rect.height,
      dpi: window.devicePixelRatio,
    };

    canvasRef.current.width = s.render.width * s.render.dpi;
    canvasRef.current.height = s.render.height * s.render.dpi;
  }, []);

  const setDiscs = useCallback(() => {
    if (!state.current.rect) return;
    const s = state.current;
    const { width, height } = s.rect;

    s.discs = [];
    s.startDisc = { x: width * 0.5, y: height * 0.45, w: width * 0.75, h: height * 0.7 };
    s.endDisc = { x: width * 0.5, y: height * 0.95, w: 0, h: 0 };

    const totalDiscs = 100;
    let prevBottom = height;
    s.clip = {};

    for (let i = 0; i < totalDiscs; i++) {
      const p = i / totalDiscs;
      const disc = tweenDisc({ p });
      const bottom = disc.y + disc.h;
      if (bottom <= prevBottom) {
        s.clip = { disc: { ...disc }, i };
      }
      prevBottom = bottom;
      s.discs.push(disc);
    }
    
    if (s.clip.disc) {
        s.clip.path = new Path2D();
        s.clip.path.ellipse(s.clip.disc.x, s.clip.disc.y, s.clip.disc.w, s.clip.disc.h, 0, 0, Math.PI * 2);
        s.clip.path.rect(s.clip.disc.x - s.clip.disc.w, 0, s.clip.disc.w * 2, s.clip.disc.y);
    }
  }, [tweenDisc]);
  
  const setLines = useCallback(() => {
    if (!state.current.rect || !state.current.clip.path) return;
    const s = state.current;
    const { width, height } = s.rect;

    s.lines = [];
    const totalLines = 100;
    const linesAngle = (Math.PI * 2) / totalLines;

    for (let i = 0; i < totalLines; i++) s.lines.push([]);

    s.discs.forEach((disc) => {
      for (let i = 0; i < totalLines; i++) {
        const angle = i * linesAngle;
        const p = { x: disc.x + Math.cos(angle) * disc.w, y: disc.y + Math.sin(angle) * disc.h };
        s.lines[i].push(p);
      }
    });

    s.linesCanvas = new OffscreenCanvas(width, height);
    const ctx = s.linesCanvas.getContext('2d');
    if (!ctx) return;
    
    s.lines.forEach((line) => {
      ctx.save();
      let lineIsIn = false;
      line.forEach((p1, j) => {
        if (j === 0) return;
        const p0 = line[j - 1];

        if (!lineIsIn && (ctx.isPointInPath(s.clip.path!, p1.x, p1.y) || ctx.isPointInStroke(s.clip.path!, p1.x, p1.y))) {
          lineIsIn = true;
        } else if (lineIsIn) {
          ctx.clip(s.clip.path!);
        }
        
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });
      ctx.restore();
    });
    s.linesCtx = ctx;
  }, []);
  
  const setParticles = useCallback(() => {
    if (!state.current.rect || !state.current.clip.disc) return;
    const s = state.current;
    const { width, height } = s.rect;

    s.particles = [];
    s.particleArea = {
      sw: s.clip.disc.w * 0.5,
      ew: s.clip.disc.w * 2,
      h: height * 0.85,
    };
    s.particleArea.sx = (width - s.particleArea.sw) / 2;
    s.particleArea.ex = (width - s.particleArea.ew) / 2;

    for (let i = 0; i < 100; i++) {
      s.particles.push(initParticle(true));
    }
  }, [initParticle]);

  const setup = useCallback(() => {
    setSize();
    setDiscs();
    setLines();
    setParticles();
  }, [setSize, setDiscs, setLines, setParticles]);

  const tick = useCallback(() => {
    const s = state.current;
    if (!s.ctx || !canvasRef.current) return;

    s.ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    s.ctx.save();
    s.ctx.scale(s.render.dpi, s.render.dpi);

    // Move
    s.discs.forEach((disc) => {
      disc.p = (disc.p + 0.001) % 1;
      tweenDisc(disc);
    });
    s.particles.forEach((particle) => {
      particle.p = 1 - particle.y / s.particleArea.h;
      particle.x = particle.sx + particle.dx * particle.p;
      particle.y -= particle.vy;
      if (particle.y < 0) {
        Object.assign(particle, initParticle());
      }
    });

    // Draw
    if(s.clip.path) {
        s.ctx.strokeStyle = '#444';
        s.ctx.lineWidth = 2;
        const outerDisc = s.startDisc;
        s.ctx.beginPath();
        s.ctx.ellipse(outerDisc.x, outerDisc.y, outerDisc.w, outerDisc.h, 0, 0, Math.PI * 2);
        s.ctx.stroke();
        s.ctx.closePath();

        s.discs.forEach((disc, i) => {
            if (i % 5 !== 0) return;
            if (disc.w < s.clip.disc.w - 5) {
                s.ctx!.save();
                s.ctx!.clip(s.clip.path!);
            }
            s.ctx!.beginPath();
            s.ctx!.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
            s.ctx!.stroke();
            s.ctx!.closePath();
            if (disc.w < s.clip.disc.w - 5) {
                s.ctx!.restore();
            }
        });

        if (s.linesCanvas) s.ctx.drawImage(s.linesCanvas, 0, 0);

        s.ctx.save();
        s.ctx.clip(s.clip.path);
        s.particles.forEach((particle) => {
            s.ctx!.fillStyle = particle.c;
            s.ctx!.beginPath();
            s.ctx!.rect(particle.x, particle.y, particle.r, particle.r);
            s.ctx!.closePath();
            s.ctx!.fill();
        });
        s.ctx.restore();
    }
    
    s.ctx.restore();
    animationFrameId.current = requestAnimationFrame(tick);
  }, [tweenDisc, initParticle]);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      state.current.ctx = canvasRef.current.getContext('2d');
      setup();
      
      const resizeObserver = new ResizeObserver(setup);
      resizeObserver.observe(containerRef.current);

      animationFrameId.current = requestAnimationFrame(tick);
      
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        resizeObserver.disconnect();
      };
    }
  }, [setup, tick]);

  return (
    <>
      <style jsx>{`
        .deep-hole-container {
          position: absolute;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #141414;
        }
        .deep-hole-container:before {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          display: block;
          width: 150%;
          height: 140%;
          background: radial-gradient(ellipse at 50% 55%, transparent 10%, black 50%);
          transform: translate3d(-50%, -50%, 0);
          content: "";
        }
        .deep-hole-container:after {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          display: block;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 50% 75%, #a900ff 20%, transparent 75%);
          mix-blend-mode: overlay;
          transform: translate3d(-50%, -50%, 0);
          content: "";
        }
        .aura {
          position: absolute;
          top: -71.5%;
          left: 50%;
          z-index: 3;
          width: 30%;
          height: 140%;
          background: linear-gradient(
              20deg,
              #00f8f1,
              rgba(255, 189, 30, 0.125),
              #fe848f 33%,
              rgba(254, 132, 143, 0.125) 49.5%,
              #00f8f1 66%,
              rgba(0, 248, 241, 0.375) 85.5%,
              #ffbd1e 100%
            )
            0 100% / 100% 200%;
          border-radius: 0 0 100% 100%;
          filter: blur(50px);
          mix-blend-mode: plus-lighter;
          opacity: 0.75;
          transform: translate3d(-50%, 0, 0);
          animation: aura-glow 5s infinite linear;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            transparent,
            transparent 1px,
            white 1px,
            white 2px
          );
          mix-blend-mode: overlay;
          opacity: 0.5;
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
        }
        @keyframes aura-glow {
          0% { background-position: 0 100%; }
          100% { background-position: 0 300%; }
        }
      `}</style>
      <div ref={containerRef} className="deep-hole-container absolute inset-0 -z-10">
        <canvas ref={canvasRef}></canvas>
        <div className="aura"></div>
        <div className="overlay"></div>
      </div>
    </>
  );
}
