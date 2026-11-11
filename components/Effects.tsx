"use client";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";

/* Las secciones aparecen "cargándose" (pasos discretos, no fundido suave) */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

/* El enlace se desplaza ligeramente hacia el ratón */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.25;
    el.style.transform = `translate(${x}px,${y}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <span ref={ref} className="magnetic" onPointerMove={move} onPointerLeave={leave}>{children}</span>;
}

/* Las palabras se iluminan según avanzas por el párrafo */
export function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("span"));
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)));
      spans.forEach((s, i) => s.classList.toggle("lit", i < p * spans.length));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  return <p ref={ref} className="ww">{words.map((w, i) => <span key={i}>{w + " "}</span>)}</p>;
}

const GLYPHS = "!<>-_/[]{}=+*^?#01";

/* Descifra el texto al entrar en pantalla y/o al pasar el ratón.
   Si hay un ancestro con data-decrypt, el hover se detecta sobre ese contenedor. */
export function Decrypt({ text, trigger = "view", duration = 700 }: { text: string; trigger?: "view" | "hover" | "both"; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = Array.from(text);
    const run = () => {
      if (reduce) return;
      cancelAnimationFrame(raf.current);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        setOut(chars.map((c, i) => (c === " " || i < p * chars.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };
    const root: Element = el.closest("[data-decrypt]") ?? el;
    let io: IntersectionObserver | undefined;
    if (trigger !== "view") { root.addEventListener("pointerenter", run); root.addEventListener("focusin", run); }
    if (trigger !== "hover") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io?.disconnect(); run(); } }, { threshold: 0.6 });
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf.current);
      root.removeEventListener("pointerenter", run);
      root.removeEventListener("focusin", run);
    };
  }, [text, trigger, duration]);

  return <span ref={ref} aria-label={text}>{out}</span>;
}