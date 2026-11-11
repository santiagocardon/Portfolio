"use client";
import { useEffect, useRef } from "react";

const COLS = 140;      // más columnas = más detalle y más coste (si va lento, baja a 110)
const FOCUS_Y = 0.25;  // recorte cuadrado de la foto: 0 = parte de arriba, 0.5 = centro, 1 = abajo

/* Foto circular que se forma a partir de partículas cuadradas que parten de una esfera en blanco y negro.
   Al formarse pasa a color y aparece la foto original a su resolución normal.
   Mantén pulsado para volver a la esfera; al soltar se recompone. */
export function ParticlePhoto({ src, alt }: { src: string; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = box.current!;
    const canvas = cv.current!;
    const photo = imgRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false, dead = false, started = false, spin = 0;
    let t = reduce ? 1 : 0, v = 0, goal = reduce ? 1 : 0; // t: 0 = esfera, 1 = foto
    let W = 0;
    let sx = new Float32Array(0), sy = sx, sz = sx, rnd = sx, ux = sx, uy = sx, px = sx, py = sx;
    let groups: { fill: string; idx: number[] }[] = [];
    const timers: number[] = [];

    const build = (img: HTMLImageElement) => {
      // Recorte cuadrado de la foto (la misma zona que muestra la imagen final)
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx0 = (img.naturalWidth - side) * 0.5;
      const sy0 = (img.naturalHeight - side) * FOCUS_Y;
      const off = document.createElement("canvas");
      off.width = COLS; off.height = COLS;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.imageSmoothingQuality = "high";
      o.drawImage(img, sx0, sy0, side, side, 0, 0, COLS, COLS);
      const d = o.getImageData(0, 0, COLS, COLS).data;

      // Solo las partículas que caen dentro del círculo
      const us: number[] = [], vs: number[] = [], keys: number[] = [];
      for (let i = 0; i < COLS * COLS; i++) {
        const x = ((i % COLS) + 0.5) / COLS - 0.5, y = (Math.floor(i / COLS) + 0.5) / COLS - 0.5;
        if (x * x + y * y > 0.25) continue;
        us.push(x + 0.5); vs.push(y + 0.5);
        keys.push(((d[i * 4] >> 4) << 8) | ((d[i * 4 + 1] >> 4) << 4) | (d[i * 4 + 2] >> 4));
      }
      const N = us.length;
      ux = Float32Array.from(us); uy = Float32Array.from(vs);
      sx = new Float32Array(N); sy = new Float32Array(N); sz = new Float32Array(N);
      rnd = new Float32Array(N); px = new Float32Array(N); py = new Float32Array(N);
      const map = new Map<number, number[]>();
      for (let i = 0; i < N; i++) {
        (map.get(keys[i]) ?? map.set(keys[i], []).get(keys[i])!).push(i);
        const y = 1 - ((i + 0.5) / N) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996323;
        sx[i] = Math.cos(a) * r; sy[i] = y; sz[i] = Math.sin(a) * r; rnd[i] = Math.random();
      }
      groups = [...map.entries()].map(([k, idx]) => ({
        fill: `rgb(${((k >> 8) & 15) * 16 + 8},${((k >> 4) & 15) * 16 + 8},${(k & 15) * 16 + 8})`,
        idx,
      }));
    };

    // Blanco y negro en la esfera, color al formarse; la foto original aparece cuando ya está completa
    const sync = () => {
      canvas.style.filter = t >= 0.999 ? "none" : `grayscale(${Math.min(1, Math.max(0, 1 - t))})`;
      photo.style.opacity = goal === 1 && t > 0.985 ? "1" : "0";
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, W);
      const R = W * 0.46, c = W / 2;
      const cs = Math.cos(spin), sn = Math.sin(spin), size = (W / COLS) * 1.05;
      for (const g of groups) {
        ctx.fillStyle = g.fill;
        for (const i of g.idx) {
          const ti = Math.min(1, Math.max(0, t * 1.4 - rnd[i] * 0.4));
          const e = ti * ti * (3 - 2 * ti);
          const gx = c + (sx[i] * cs + sz[i] * sn) * R, gy = c + sy[i] * R;
          ctx.fillRect(gx + (px[i] - gx) * e - size / 2, gy + (py[i] - gy) * e - size / 2, size, size);
        }
      }
      sync();
    };

    const resize = () => {
      W = el.clientWidth;
      if (!W || !groups.length) return;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = W * dpr; canvas.height = W * dpr;
      canvas.style.height = W + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < px.length; i++) { px[i] = ux[i] * W; py[i] = uy[i] * W; }
      draw();
    };

    const step = () => {
      raf = 0;
      v += (goal - t) * 0.08; v *= 0.86; t += v; spin += 0.006;
      draw();
      const settled = goal === 1 && Math.abs(goal - t) < 0.001 && Math.abs(v) < 0.001;
      if (!settled && visible && !dead) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(step); };

    const down = () => { if (!reduce) { goal = 0; kick(); } };
    const up = () => { if (!reduce) { goal = 1; kick(); } };
    canvas.addEventListener("pointerdown", down);
    (["pointerup", "pointerleave", "pointercancel"] as const).forEach((e) => canvas.addEventListener(e, up));

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !started) {
        started = true;
        timers.push(window.setTimeout(() => { goal = 1; kick(); }, 400));
      }
      if (visible) kick();
    }, { threshold: 0.3 });
    const ro = new ResizeObserver(resize);

    const img = new Image();
    img.onload = () => {
      if (dead) return;
      build(img); resize(); io.observe(el); ro.observe(el);
    };
    img.onerror = () => { el.dataset.error = "true"; };
    img.src = src;

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      io.disconnect(); ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      (["pointerup", "pointerleave", "pointercancel"] as const).forEach((e) => canvas.removeEventListener(e, up));
    };
  }, [src]);

  return (
    <div ref={box} className="pp">
      <div className="pp-stage">
        <canvas ref={cv} role="img" aria-label={alt} />
        <img ref={imgRef} className="pp-img" src={src} alt="" aria-hidden="true" style={{ objectPosition: `50% ${FOCUS_Y * 100}%` }} />
      </div>
      <p className="pp-err muted">{"// añade tu foto en public/foto.jpg"}</p>
      <noscript><img src={src} alt={alt} width={180} height={180} style={{ borderRadius: "50%", objectFit: "cover" }} /></noscript>
    </div>
  );
}