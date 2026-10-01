import {
  LocateFixed, Play, Satellite, Route, Gauge, Map, FileDown, ShieldCheck,
  CheckCircle2, XCircle, Puzzle, Globe, Spline, Zap, Layers, Smartphone, Lock, ArrowRight, type LucideIcon,
} from "lucide-react";
import Tracker from "@/components/Tracker";

const features: { icon: LucideIcon; color: string; title: string; text: string }[] = [
  { icon: Satellite, color: "blue", title: "Live Stream Geolocation", text: "Uses the high-accuracy watchPosition API to stream latitude and longitude as you move." },
  { icon: Spline, color: "indigo", title: "Real-Time Polyline Route", text: "Draws a breadcrumb path on a Leaflet map to show your exact route." },
  { icon: Gauge, color: "amber", title: "Speed & Distance Telemetry", text: "Live speed in km/h and mph, with total distance calculated using the Haversine formula." },
  { icon: Map, color: "emerald", title: "Multi-Tile Map Engine", text: "Switch between Dark and Street map views on the fly." },
  { icon: FileDown, color: "cyan", title: "GeoJSON Route Export", text: "Export your route as GeoJSON for QGIS, Google Earth and other GIS tools." },
  { icon: ShieldCheck, color: "rose", title: "Zero Data Storage", text: "Coordinates stay in your device's memory and are never sent to a server." },
];

// Full class strings so Tailwind can detect them at build time
const tint: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
};

const webPros = [
  ["Direct Mobile Sensor Access", "Uses the real GPS chip in iOS and Android phones."],
  ["Zero Installation Barrier", "Opens instantly in any modern browser via a shareable URL."],
  ["On-The-Go Movement", "Built for walking, cycling, driving and field tracking."],
  ["Easy Route Sharing", "Export files for analysis on any device."],
];
const extCons = [
  ["Desktop Hardware Limits", "Most laptops lack GPS and fall back to inaccurate IP positioning."],
  ["Installation Friction", "Needs a manual download and browser store install."],
  ["Mobile Incompatibility", "Mobile browsers have limited or no extension support."],
  ["Static Location", "Desktops stay put, so continuous tracking is pointless."],
];
const steps = [
  ["Grant GPS Permission", 'Click "Start Live Tracking" and allow your browser to use location sensors.', "bg-blue-600"],
  ["Begin Movement", "Walk, run or drive. Coordinates, speed and distance update continuously.", "bg-indigo-600"],
  ["Visualize & Export", "Watch your route draw live, then export it as GeoJSON.", "bg-cyan-600"],
];

function Heading({ tag, title, text }: { tag: string; title: string; text: string }) {
  return (
    <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400">{tag}</span>
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="text-sm text-slate-400 sm:text-base">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <header className="glass-card fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 px-4 py-3.5 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#hero" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-lg shadow-blue-500/25">
              <LocateFixed className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-white">
                GeoPulse
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">LIVE</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Real-Time Geolocation</span>
            </div>
          </a>
          <nav className="hidden items-center space-x-8 text-sm font-medium text-slate-300 md:flex">
            {[["#hero", "Home"], ["#features", "Features"], ["#live-tracker", "Live App"], ["#comparison", "Web vs Extension"], ["#how-it-works", "How It Works"]].map(([h, l]) => (
              <a key={h} href={h} className="transition hover:text-blue-400">{l}</a>
            ))}
          </nav>
          <a href="#live-tracker" className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30">
            <Play className="h-3 w-3" /><span>Launch Tracker</span>
          </a>
        </div>
      </header>

      <section id="hero" className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-44">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="pointer-events-none absolute right-10 top-1/3 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="glass-card inline-flex items-center space-x-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>Zero Installation Needed • 100% Client-Side Privacy</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Track Your Journey in <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Real Time</span> With Precision
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
                Live GPS telemetry, route drawing, speed monitoring and coordinate logging right in your browser. No plugins, no apps, no tracking databases.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
                <a href="#live-tracker" className="group flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 sm:w-auto">
                  <span>Launch Live Tracker</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#comparison" className="glass-card flex w-full items-center justify-center space-x-2 rounded-2xl px-7 py-3.5 text-sm font-semibold text-slate-200 sm:w-auto">
                  <Layers className="h-4 w-4 text-slate-400" /><span>Web App vs Extension</span>
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-800/80 pt-6 text-xs font-medium text-slate-500 lg:justify-start">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />Private & Local Processing</span>
                <span className="flex items-center gap-2"><Satellite className="h-4 w-4 text-blue-400" />High Accuracy GPS Fix</span>
                <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-indigo-400" />Mobile & Desktop Compatible</span>
              </div>
            </div>

            {/* Preview card */}
            <div className="relative lg:col-span-5">
              <div className="glass-card relative mx-auto max-w-md overflow-hidden rounded-3xl border-slate-800 p-6 shadow-2xl lg:max-w-none">
                <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" /><div className="h-3 w-3 rounded-full bg-amber-500/80" /><div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400"><span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />SATELLITE_LINK_ACTIVE</span>
                </div>
                <div className="relative z-10 space-y-4 py-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[["Latitude", "37.774929°"], ["Longitude", "-122.419416°"]].map(([l, v]) => (
                      <div key={l} className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3.5">
                        <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">{l}</span>
                        <span className="font-mono text-base font-bold text-blue-400">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Speed", "14.2 km/h", "text-amber-400"], ["Accuracy", "± 3 m", "text-emerald-400"], ["Distance", "2.84 km", "text-indigo-400"]].map(([l, v, c]) => (
                      <div key={l} className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-2.5 text-center">
                        <span className="block text-[9px] font-semibold uppercase text-slate-400">{l}</span>
                        <span className={`font-mono text-xs font-bold ${c}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card absolute -bottom-3 -left-3 z-20 flex animate-bounce items-center space-x-3 rounded-2xl border-slate-700/80 px-4 py-2.5 shadow-2xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400"><Route className="h-4 w-4" /></div>
                  <div><p className="text-[10px] font-medium text-slate-400">Path Polyline</p><p className="text-xs font-bold text-slate-200">Active Tracing</p></div>
                </div>
                <div className="glass-card absolute -right-4 -top-4 z-20 flex items-center space-x-3 rounded-2xl border-slate-700/80 px-4 py-2.5 shadow-2xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400"><Zap className="h-4 w-4" /></div>
                  <div><p className="text-[10px] font-medium text-slate-400">Update Rate</p><p className="text-xs font-bold text-slate-200">Real-Time Stream</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading tag="Capabilities" title="Engineered For Precision Motion Tracking" text="Browser geolocation hardware combined with Leaflet maps for continuous telemetry." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, color, title, text }) => (
              <div key={title} className="glass-card glass-card-hover rounded-3xl p-6">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${tint[color]}`}><Icon className="h-5 w-5" /></div>
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Tracker />

      <section id="comparison" className="border-t border-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading tag="Architectural Comparison" title="Why a Web App Beats an Extension" text="A responsive web app can use real phone GPS hardware; a desktop extension can't." />
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { title: "Web Application (PWA)", sub: "Cross-Platform Mobility", Icon: Globe, Mark: CheckCircle2, mark: "text-emerald-400", items: webPros, cls: "border-2 border-blue-500/40", rec: true },
              { title: "Browser Extension", sub: "Desktop Browser Specific", Icon: Puzzle, Mark: XCircle, mark: "text-rose-500", items: extCons, cls: "border border-slate-800 text-slate-400" },
            ].map(({ title, sub, Icon, Mark, mark, items, cls, rec }) => (
              <div key={title} className={`glass-card relative overflow-hidden rounded-3xl p-8 ${cls}`}>
                {rec && <div className="absolute right-0 top-0 rounded-bl-2xl bg-blue-600 px-4 py-1.5 text-[10px] font-extrabold uppercase text-white">Recommended</div>}
                <div className="mb-6 flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800"><Icon className="h-5 w-5" /></div>
                  <div><h3 className="text-xl font-bold text-white">{title}</h3><p className="text-xs text-slate-500">{sub}</p></div>
                </div>
                <ul className="space-y-4 text-sm">
                  {items.map(([t, d]) => (
                    <li key={t} className="flex items-start space-x-3">
                      <Mark className={`mt-0.5 h-5 w-5 shrink-0 ${mark}`} />
                      <span><strong>{t}:</strong> {d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Heading tag="Step-By-Step Workflow" title="How GeoPulse Works" text="Start tracking your live route in three steps." />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(([t, d, bg], i) => (
              <div key={t} className="glass-card space-y-4 rounded-3xl p-8 text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold text-white ${bg}`}>{i + 1}</div>
                <h3 className="text-lg font-bold text-white">{t}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-blue-900/20 via-slate-900 to-indigo-900/20 p-8 md:flex-row">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"><Lock className="h-6 w-6" /></div>
              <div>
                <h4 className="text-lg font-bold text-white">100% On-Device Privacy Guaranteed</h4>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">GeoPulse runs entirely in your browser's memory. Your location logs are never stored, transmitted or sold.</p>
              </div>
            </div>
            <a href="#live-tracker" className="shrink-0 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-700">Try Live App Now</a>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-slate-900 py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <span><b className="text-slate-300">GeoPulse</b> — Open-Source Real-Time Geolocation Tracker</span>
          <span>Powered by Leaflet & OpenStreetMap</span>
        </div>
      </footer>
    </>
  );
}