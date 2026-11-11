"use client";
import { useEffect, useState, type FC } from "react";
import { motion } from "motion/react";
import { IoMoon, IoMoonOutline, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "next-themes";

interface SwitchModeProps {
  width?: number; height?: number;
  darkColor?: string; lightColor?: string;
  knobDarkColor?: string; knobLightColor?: string;
  borderDarkColor?: string; borderLightColor?: string;
}

export const SwitchMode: FC<SwitchModeProps> = ({
  width = 56, height = 28,
  darkColor = "#111", lightColor = "#F9F9F9",
  knobDarkColor = "#1C1C1C", knobLightColor = "#EDEDED",
  borderDarkColor = "#444", borderLightColor = "#BDBDBD",
}) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  if (!mounted) return <div style={{ width, height }} className="rounded-full border-2 border-transparent" />;

  const isDark = resolvedTheme === "dark";
  const iconSize = height * 0.45;

  return (
    <motion.button
      type="button"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center rounded-full border-2 transition-colors"
      style={{ width, height, borderColor: isDark ? borderDarkColor : borderLightColor, cursor: "pointer" }}
    >
      <motion.div className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: isDark ? darkColor : lightColor }} transition={{ duration: 0.4 }} />
      <motion.div layout transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="absolute rounded-full border-2 z-30"
        style={{ width: height, height, right: isDark ? -2 : undefined, left: isDark ? undefined : -2,
          backgroundColor: isDark ? knobDarkColor : knobLightColor,
          borderColor: isDark ? borderDarkColor : borderLightColor }} />
      <motion.div className="relative z-30 flex items-center justify-center" style={{ width: height, height }}
        animate={{ rotate: isDark ? 45 : 0 }}>
        {isDark
          ? <IoSunnyOutline color="#8A8A8A" style={{ width: iconSize, height: iconSize }} />
          : <IoSunny color="#666666" style={{ width: iconSize, height: iconSize }} />}
      </motion.div>
      <motion.div className="relative z-30 flex items-center justify-center" style={{ width: height, height }}
        animate={{ rotate: isDark ? 0 : 15 }}>
        {isDark
          ? <IoMoon color="#F4F4F4" style={{ width: iconSize, height: iconSize }} />
          : <IoMoonOutline color="#AAAAAA" style={{ width: iconSize, height: iconSize }} />}
      </motion.div>
    </motion.button>
  );
};
