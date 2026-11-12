import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lear benchmark report: accuracy, cost and competitive position",
  description:
    "Interactive benchmark report for the Lear diagnosis engine (2026-11-12): accuracy against single-agent and multi-agent designs, cost per incident, safety, and third-party ITBench-AA results.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Lear benchmark report",
    description: "Lear is cheaper than every design tested, and changes observe-only components in 0% of runs.",
    type: "article",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1530",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        {children}
      </body>
    </html>
  );
}
