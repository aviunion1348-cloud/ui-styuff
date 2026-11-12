import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lear diagnosis engine: accuracy, cost and competitive position",
  description:
    "Benchmark report, 12 November 2026, Protocol v1.5. Lear against single-agent and multi-agent designs: accuracy with 95% intervals, cost per incident, scope safety, ITBench-AA.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
          <defs id="grad-defs">
            <linearGradient id="grad-lear" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f6d98f" />
              <stop offset="0.42" stopColor="#e8b75f" />
              <stop offset="1" stopColor="#ef8fbb" />
            </linearGradient>
          </defs>
        </svg>
        <a className="skip" href="#main">
          Skip to report
        </a>
        {children}
      </body>
    </html>
  );
}
