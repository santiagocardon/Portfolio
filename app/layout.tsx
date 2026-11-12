import type { Metadata } from "next";
import { DotGothic16, Space_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { BootScreen } from "@/components/BootScreen";
import { GridBackground, Cursor, ScrollProgress } from "@/components/Ambient";
import "./globals.css";

const pixel = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://santiagocardona.xyz"),
  title: "Santiago Cardona | Desarrollador Backend Java Junior",
  description:
    "Portfolio de Santiago Cardona, estudiante de 2.º de DAM en Madrid. Desarrollo backend con Java, JDBC, SQL y PostgreSQL; Spring Boot en aprendizaje.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Santiago Cardona",
    title: "Santiago Cardona | Desarrollador Backend Java Junior",
    description: "Estudiante de 2.º de DAM en Madrid. Backend con Java, JDBC, SQL y PostgreSQL.",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Cardona | Desarrollador Backend Java Junior",
    description: "Estudiante de 2.º de DAM en Madrid. Backend con Java, JDBC, SQL y PostgreSQL.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${pixel.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.boot{display:none!important}.tw-off{visibility:visible!important}.reveal,.ww span{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <BootScreen />
          <GridBackground />
          <ScrollProgress />
          <Cursor />
          <div className="scan" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}