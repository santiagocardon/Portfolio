"use client";
import { useEffect, useRef } from "react";
import { TypeText } from "@/components/TypeText";
import { ParticlePhoto } from "@/components/ParticlePhoto";

const TOP = 56; // alto del header fijo

/* "Sobre mí" queda fijo en pantalla mientras el scroll ilumina las palabras.
   Cuando el texto está completo, la página sigue. */
export function PinnedAbout({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = wrap.current;
    const p = para.current;
    if (!el || !p) return;
    const spans = Array.from(p.querySelectorAll<HTMLElement>("span"));
    const update = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - (innerHeight - TOP); // scroll disponible mientras está fijo
      // El texto termina al 80% del recorrido; el resto es una pausa con el texto completo
      const progress = travel > 0 ? Math.min(1, Math.max(0, (TOP - r.top) / (travel * 0.8))) : 1;
      spans.forEach((s, i) => s.classList.toggle("lit", i < progress * spans.length));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);

  return (
    <div ref={wrap} className="pin">
      <div className="pin-sticky">
        <h2><span className="label">{"// 02"}</span> <TypeText text="sobre mí" onView /></h2>
        <div className="about">
          <ParticlePhoto src="/foto.jpg" alt="Retrato de Santiago Cardona" />
          <p ref={para} className="ww">{words.map((w, i) => <span key={i}>{w + " "}</span>)}</p>
        </div>
      </div>
    </div>
  );
}