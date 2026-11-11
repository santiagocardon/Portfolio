"use client";
import { useEffect, useRef, useState } from "react";

type Props = { text: string; speed?: number; delay?: number; onView?: boolean; keepCursor?: boolean };

// El texto completo está siempre en el DOM (SEO/ATS); solo cambia su visibilidad.
// Un único cursor avanza con el texto.
export function TypeText({ text, speed = 45, delay = 0, onView = false, keepCursor = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const total = Array.from(text).length;
  const [count, setCount] = useState(-1); // -1 = aún no ha empezado

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    let io: IntersectionObserver | undefined;

    const run = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(total); return; }
      timers.push(window.setTimeout(() => {
        let i = 0;
        setCount(0);
        const iv = window.setInterval(() => {
          i++;
          setCount(i);
          if (i >= total) clearInterval(iv);
        }, speed);
        timers.push(iv);
      }, delay));
    };

    // No empieza a escribir hasta que termina la pantalla de carga
    const whenBooted = () => {
      if (document.documentElement.dataset.booted === "true") run();
      else addEventListener("booted", run, { once: true });
    };

    if (onView) {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { io?.disconnect(); whenBooted(); }
      }, { threshold: 0.6 });
      io.observe(el);
    } else whenBooted();

    return () => {
      io?.disconnect();
      removeEventListener("booted", run);
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    };
  }, []);

  const cursor = <span className="tw-cur" />;
  const words = text.split(" ");
  let i = 0;

  return (
    <span ref={ref} className="tw" aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="tw-word" aria-hidden="true">
          {Array.from(w + (wi < words.length - 1 ? " " : "")).map((c) => {
            const idx = i++;
            return (
              <span key={idx}>
                {idx === count && cursor}
                <span className={idx < count ? "tw-on" : "tw-off"}>{c}</span>
              </span>
            );
          })}
        </span>
      ))}
      {count >= total && keepCursor && cursor}
    </span>
  );
}