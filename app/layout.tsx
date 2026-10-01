import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "GeoPulse | Real-Time Geolocation Tracker & Telemetry",
  description: "Live GPS telemetry, route tracing and GeoJSON export in your browser.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600">
        {children}
      </body>
    </html>
  );
}