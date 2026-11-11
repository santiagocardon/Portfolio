"use client";
import { useEffect, useState } from "react";

const LINES = [
  "INITIALIZING SYSTEM...",
  "LOADING MODULES...",
  "JAVA .......... OK",
  "PYTHON ........ OK",
  "DATABASE ...... OK",
  "USER: SANTIAGO",
  "WELCOME.",
];

const markBooted = () => {
  document.documentElement.dataset.booted = "true";
  window.dispatchEvent(new Event("booted"));
};

export function BootScreen() {
  const [n, setN] = useState(0);
  const [state, setState] = useState<"run" | "out" | "done">("run");

  const finish = () => {
    markBooted();
    try { sessionStorage.setItem("booted", "1"); } catch {}
    setState("out");
    setTimeout(() => setState("done"), 500);
  };

  // Sale una vez por sesión. Con "?boot" en la URL se fuerza siempre (útil para probar).
  useEffect(() => {
    const force = new URLSearchParams(location.search).has("boot");
    let seen = false;
    try { seen = !!sessionStorage.getItem("booted"); } catch {}
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!force && (seen || reduced)) {
      markBooted();
      setState("done");
    }
  }, []);

  useEffect(() => {
    if (state !== "run") return;
    const t = setTimeout(n < LINES.length ? () => setN(n + 1) : finish, n < LINES.length ? 380 : 700);
    return () => clearTimeout(t);
  }, [n, state]);

  useEffect(() => {
    const skip = () => state === "run" && finish();
    addEventListener("keydown", skip);
    return () => removeEventListener("keydown", skip);
  }, [state]);

  if (state === "done") return null;

  const pct = Math.round((n / LINES.length) * 100);
  const bar = "█".repeat(Math.round(pct / 5)).padEnd(20, "░");

  return (
    <div className={`boot ${state === "out" ? "boot-out" : ""}`} onClick={finish} role="status" aria-live="polite">
      <pre>
        {LINES.slice(0, n).join("\n")}
        {n > 0 ? "\n\n" : ""}
        {`[${bar}] ${pct}%`}
        <span className="blk">█</span>
      </pre>
      <p className="hint">[ clic o tecla para saltar ]</p>
    </div>
  );
}