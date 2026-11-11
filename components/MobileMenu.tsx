"use client";
import { useEffect, useState } from "react";

/* Menú para móvil: botón [ menú ] que abre un panel a pantalla completa con los enlaces */
export function MobileMenu({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (innerWidth > 640) setOpen(false); };
    addEventListener("keydown", onKey);
    addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden"; // bloquea el scroll de fondo
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="mm">
      <button
        type="button"
        className="mm-btn"
        aria-expanded={open}
        aria-controls="mm-panel"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "[x] cerrar" : "[ menú ]"}
      </button>
      {open && (
        <div id="mm-panel" className="mm-panel" role="navigation" aria-label="Navegación principal">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={() => setOpen(false)}>{`> ${i.label}`}</a>
          ))}
        </div>
      )}
    </div>
  );
}