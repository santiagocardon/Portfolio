"use client";
import { useEffect, useRef, useState } from "react";

/* Grid casi imperceptible; una capa algo más visible se revela solo alrededor del ratón */
export function GridBackground() {
  const hot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        hot.current?.style.setProperty("--mx", e.clientX + "px");
        hot.current?.style.setProperty("--my", e.clientY + "px");
      });
    };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div className="grid" aria-hidden="true" />
      <div className="grid grid-hot" ref={hot} aria-hidden="true" />
    </>
  );
}

/* Cursor cuadrado parpadeante; sobre enlaces y botones pasa a ">_". Solo en dispositivos con ratón */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [link, setLink] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    setOn(true);
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      setLink(!!(e.target as Element).closest?.("a,button"));
    };
    addEventListener("pointermove", move);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!on) return null;
  return (
    <div ref={ref} className={`cursor ${link ? "cursor-link" : ""}`} aria-hidden="true">
      {link ? ">_" : ""}
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    f();
    addEventListener("scroll", f, { passive: true });
    addEventListener("resize", f);
    return () => { removeEventListener("scroll", f); removeEventListener("resize", f); };
  }, []);
  return <div className="progress" ref={bar} aria-hidden="true" />;
}