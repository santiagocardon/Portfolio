"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Decrypt } from "@/components/Effects";
import type { Project, ReadmeBlock } from "@/content";

function Block({ b }: { b: ReadmeBlock }) {
  switch (b.t) {
    case "cmd":
      return <p className="t-cmd"><span className="t-prompt">$ </span>{b.text}</p>;
    case "h1":
      return <h3 className="t-h1">{`# ${b.text}`}</h3>;
    case "h2":
      return <h4 className="t-h2">{`## ${b.text}`}</h4>;
    case "p":
      return <p>{b.text}</p>;
    case "list":
      return <ul className="proj-list">{b.items.map((t) => <li key={t}>{`- ${t}`}</li>)}</ul>;
    case "pre":
      return <pre className="proj-tree">{b.text}</pre>;
    case "code":
      return <pre className="proj-tree"><code>{b.text}</code></pre>;
  }
}

/* README del proyecto con estilo de consola */
function Readme({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <div className="term">
      <div className="term-bar">
        <span className="muted">{`santiago@madrid:~/proyectos/${p.slug}`}</span>
        <button type="button" className="proj-close" onClick={onClose}>[x] cerrar</button>
      </div>
      <div className="term-body">
        {p.readme!.map((b, i) => <Block key={i} b={b} />)}
        <p className="t-cmd"><span className="t-prompt">$ </span><span className="blk">█</span></p>
      </div>
    </div>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <article className="hs-card" data-decrypt>
      <span className="label">{`// 0${i + 1}${p.status ? ` · ${p.status}` : ""}`}</span>
      <h3><Decrypt text={p.title} trigger="hover" /></h3>
      <p>{p.summary}</p>
      {p.stack.length > 0 && <p className="muted">{p.stack.join(" · ")}</p>}
      <div className="hs-links">
        {p.repo && <a href={p.repo}>repo</a>}
        {p.url && <a href={p.url}>demo</a>}
      </div>
      {p.readme && (
        <>
          <button type="button" className="hs-open" onClick={() => dlg.current?.showModal()}>
            <span aria-hidden="true">&gt; </span><Decrypt text="leer README" trigger="hover" />
          </button>
          <dialog
            ref={dlg}
            className="proj"
            aria-label={`README de ${p.title}`}
            onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
          >
            <Readme p={p} onClose={() => dlg.current?.close()} />
          </dialog>
        </>
      )}
    </article>
  );
}

/* Con 2 o más proyectos: scroll horizontal fijo. */
function Scroller({ items }: { items: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const gal = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      const g = gal.current;
      const first = g?.firstElementChild as HTMLElement | null;
      if (g && first) setDist(Math.max(0, g.scrollWidth - first.offsetWidth));
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  return (
    <div ref={ref} className="hs" style={{ height: `${100 + (items.length - 1) * 80}vh` }}>
      <div className="hs-sticky">
        <motion.div ref={gal} className="hs-gallery" style={{ x }}>
          {items.map((p, i) => <Card key={p.slug} p={p} i={i} />)}
        </motion.div>
        <div className="hs-meta" aria-hidden="true">
          <span className="muted">scroll</span>
          <div className="hs-track"><motion.div className="hs-bar" style={{ scaleX: scrollYProgress }} /></div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsScroll({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <p className="muted">{"// en construcción"}</p>;
  // Con un solo proyecto no tiene sentido el scroll horizontal: tarjeta normal.
  if (projects.length === 1) return <div className="hs-single"><Card p={projects[0]} i={0} /></div>;
  return <Scroller items={projects} />;
}