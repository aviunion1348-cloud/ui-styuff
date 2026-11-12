import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lear diagnosis engine: accuracy, cost and competitive position",
  description:
    "Benchmark report, 12 November 2026, Protocol v1.5. Lear against single-agent and multi-agent designs: accuracy with 95% intervals, cost per incident, scope safety, ITBench-AA.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to report
        </a>
        {children}
      </body>
    </html>
  );
}
