"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Play, Pause, RotateCcw, Download, Copy, Crosshair, AlertTriangle } from "lucide-react";

type LatLng = [number, number];
type Log = { time: string; lat: number; lng: number; speed: number | null; accuracy: number };
type LayerKey = "dark" | "street";
type Place = { line: string; state: string; country: string };
type Status = { text: string; tone: "amber" | "emerald" | "red" };

// Free, keyless OpenStreetMap tiles (dark mode = same tiles darkened with CSS)
const OSM = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILES: Record<LayerKey, { url: string; attribution: string; maxZoom: number; className?: string }> = {
  dark: { url: OSM, attribution: "&copy; OpenStreetMap contributors", maxZoom: 19, className: "dark-tiles" },
  street: { url: OSM, attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 },
};

const TONES = {
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
};

function haversine(a: LatLng, b: LatLng) {
  const R = 6371e3, rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function Tracker() {
  const mapEl = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const marker = useRef<Leaflet.Marker | null>(null);
  const circle = useRef<Leaflet.Circle | null>(null);
  const line = useRef<Leaflet.Polyline | null>(null);
  const tiles = useRef<Leaflet.TileLayer | null>(null);
  const geoRef = useRef<{ lat: number; lng: number; t: number } | null>(null);
  const watchId = useRef<number | null>(null);
  const positions = useRef<LatLng[]>([]);
  const trackingRef = useRef(false);
  const followRef = useRef(true);
  const startTime = useRef<number | null>(null);
  const fixed = useRef(false);

  const [mapReady, setMapReady] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [tracking, setTracking] = useState(false);
  const [layer, setLayer] = useState<LayerKey>("dark");
  const [follow, setFollow] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [status, setStatus] = useState<Status>({ text: "Standby - Click Start", tone: "amber" });
  const [alert, setAlert] = useState<{ title: string; desc: string } | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [telemetry, setTelemetry] = useState({ speed: 0, accuracy: null as number | null, altitude: null as number | null, heading: null as number | null });
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => { followRef.current = follow; }, [follow]);

  // Reverse geocode (free OpenStreetMap Nominatim): throttled to protect its 1 request/second limit
  const geocode = useCallback(async (lat: number, lng: number) => {
    const last = geoRef.current, now = Date.now();
    if (last && (now - last.t < 10000 || haversine([last.lat, last.lng], [lat, lng]) < 50)) return;
    geoRef.current = { lat, lng, t: now };
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=en&lat=${lat}&lon=${lng}`);
      if (!r.ok) throw new Error("geocode failed");
      const { address: a = {}, display_name } = await r.json();
      const street = [a.house_number, a.road].filter(Boolean).join(" ");
      const area = a.neighbourhood || a.suburb || a.quarter || a.hamlet || a.village;
      const city = a.city || a.town || a.municipality || a.county;
      setPlace({
        line: [a.building || street, area, city].filter(Boolean).join(", ") || display_name,
        state: a.state || a.region || "--",
        country: a.country || "--",
      });
    } catch { /* keep the previous address */ }
  }, []);

  const onPosition = useCallback((pos: GeolocationPosition) => {
    const Lf = L.current, m = map.current;
    if (!Lf || !m) return;
    const { latitude: lat, longitude: lng, accuracy, altitude, speed, heading } = pos.coords;
    const here: LatLng = [lat, lng];

    setAlert(null);
    setCoords({ lat, lng });
    setTelemetry({ speed: speed && speed > 0 ? speed : 0, accuracy, altitude, heading: heading != null && !isNaN(heading) ? heading : null });

    if (!marker.current) {
      const icon = Lf.divIcon({ className: "gps-pulse-container", html: '<div class="gps-pulse-ring"></div><div class="gps-core-dot"></div>', iconSize: [32, 32], iconAnchor: [16, 16] });
      marker.current = Lf.marker(here, { icon }).addTo(m);
      circle.current = Lf.circle(here, { radius: accuracy, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 1 }).addTo(m);
      m.setView(here, 18); // street/house level
    } else {
      marker.current.setLatLng(here);
      circle.current?.setLatLng(here).setRadius(accuracy);
    }
    geocode(lat, lng);

    if (trackingRef.current) {
      const prev = positions.current[positions.current.length - 1];
      if (prev) setDistance((d) => d + haversine(prev, here));
      positions.current.push(here);
      line.current?.setLatLngs(positions.current);
      setLogs((l) => [{ time: new Date(pos.timestamp).toLocaleTimeString(), lat, lng, speed, accuracy }, ...l]);
      if (followRef.current) m.panTo(here, { animate: true });
    }
    if (!fixed.current) {
      fixed.current = true;
      if (!trackingRef.current) setStatus({ text: "Live Location Locked", tone: "emerald" });
    }
  }, [geocode]);

  const pause = useCallback(() => {
    trackingRef.current = false;
    setTracking(false);
    setStatus({ text: "Recording Paused - Live View On", tone: "amber" });
  }, []);

  const onError = useCallback((e: GeolocationPositionError) => {
    if (trackingRef.current) pause();
    const msgs: Record<number, string> = {
      1: "Location permission denied. Enable location access in your browser settings.",
      2: "GPS signal unavailable. Make sure location services are on.",
      3: "GPS request timed out. Try again.",
    };
    setAlert({ title: "GPS Signal Error", desc: msgs[e.code] ?? "Geolocation signal error." });
    setStatus({ text: "Signal Error", tone: "red" });
  }, [pause]);

  // Create the Leaflet map once (Leaflet needs `window`, so import it here)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Lf = await import("leaflet");
      if (cancelled || !mapEl.current || map.current) return;
      L.current = Lf;
      const m = Lf.map(mapEl.current).setView([20, 0], 2);
      map.current = m;
      tiles.current = Lf.tileLayer(TILES.dark.url, TILES.dark).addTo(m);
      line.current = Lf.polyline([], { color: "#3b82f6", weight: 5, opacity: 0.85, lineCap: "round", lineJoin: "round" }).addTo(m);
      setMapReady(true);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = circle.current = line.current = tiles.current = null;
    };
  }, []);

  // Always-on live location: marker, coordinates and telemetry follow the user.
  // Route recording (path, distance, log) only happens while `tracking` is true.
  useEffect(() => {
    if (!mapReady) return;
    if (!("geolocation" in navigator)) {
      setAlert({ title: "Unsupported", desc: "Geolocation is not supported by this browser." });
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(onPosition, onError, { enableHighAccuracy: highAccuracy, maximumAge: 1000, timeout: 20000 });
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    };
  }, [mapReady, highAccuracy, onPosition, onError]);

  // Tile layer switching
  useEffect(() => {
    const Lf = L.current, m = map.current;
    if (!Lf || !m) return;
    tiles.current?.remove();
    tiles.current = Lf.tileLayer(TILES[layer].url, TILES[layer]).addTo(m);
    tiles.current.bringToBack();
  }, [layer]);

  // Duration timer
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => startTime.current && setElapsed(Date.now() - startTime.current), 1000);
    return () => clearInterval(id);
  }, [tracking]);

  const start = () => {
    if (!("geolocation" in navigator)) return setAlert({ title: "Error", desc: "Geolocation API unavailable." });
    trackingRef.current = true;
    startTime.current ??= Date.now();
    setTracking(true);
    setStatus({ text: "Live Tracking Active", tone: "emerald" });
  };

  const reset = () => {
    pause();
    positions.current = [];
    startTime.current = null;
    line.current?.setLatLngs([]);
    setLogs([]);
    setDistance(0);
    setElapsed(0);
    setTelemetry((t) => ({ ...t, speed: 0 }));
    setStatus({ text: "Standby - Click Start", tone: "amber" });
  };

  const copyCoords = async () => {
    if (!coords) return;
    const text = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
    setAlert({ title: "Coordinates Copied!", desc: `${text} copied to your clipboard.` });
    setTimeout(() => setAlert(null), 3000);
  };

  const exportGeoJSON = () => {
    if (!positions.current.length) return setAlert({ title: "Export Warning", desc: "No route points recorded yet." });
    const geojson = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        geometry: { type: "LineString", coordinates: positions.current.map(([la, ln]) => [ln, la]) },
        properties: { distanceMeters: distance, pointCount: positions.current.length, exportTimestamp: new Date().toISOString() },
      }],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `geopulse_track_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hh = (n: number) => String(n).padStart(2, "0");
  const s = Math.floor(elapsed / 1000);
  const duration = `${hh(Math.floor(s / 3600))}:${hh(Math.floor((s % 3600) / 60))}:${hh(s % 60)}`;
  const kmh = telemetry.speed * 3.6, mph = telemetry.speed * 2.23694;

  const stats = [
    ["Speed", `${kmh.toFixed(1)} km/h`, `${mph.toFixed(1)} mph`],
    ["Distance", `${(distance / 1000).toFixed(2)} km`, `${(distance * 0.000621371).toFixed(2)} mi`],
    ["Accuracy", telemetry.accuracy != null ? `±${Math.round(telemetry.accuracy)} m` : "--", "GPS Radius"],
    ["Altitude", telemetry.altitude != null ? `${Math.round(telemetry.altitude)} m` : "--", ""],
    ["Heading", telemetry.heading != null ? `${Math.round(telemetry.heading)}°` : "--", ""],
    ["Duration", duration, ""],
  ];

  return (
    <section id="live-tracker" className="scroll-mt-20 border-t border-slate-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Interactive Dashboard</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Live GPS Pulse Workspace</h2>
          </div>
          <div className={`flex items-center space-x-2.5 self-start rounded-2xl border px-4 py-2 text-xs font-bold md:self-auto ${TONES[status.tone]}`}>
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-current" />
            <span>{status.text}</span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-5 xl:col-span-4">
            {alert && (
              <div className="flex items-start space-x-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div><p className="mb-0.5 text-sm font-bold">{alert.title}</p><p className="text-red-300/80">{alert.desc}</p></div>
              </div>
            )}

            <div className="glass-card space-y-3 rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Coordinates</span>
                <button onClick={copyCoords} className="flex items-center space-x-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400 transition hover:text-blue-300">
                  <Copy className="h-3 w-3" /><span>Copy Lat/Lng</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([["Latitude", coords?.lat], ["Longitude", coords?.lng]] as const).map(([label, v]) => (
                  <div key={label} className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-3.5">
                    <span className="mb-1 block text-[10px] font-extrabold uppercase text-slate-500">{label}</span>
                    <span className="font-mono text-base font-bold text-blue-400 sm:text-lg">{v != null ? v.toFixed(6) : "--.------"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card space-y-3 rounded-3xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Location</span>
              <p className="text-sm font-semibold text-slate-100">{place?.line ?? "Locating your address..."}</p>
              <div className="grid grid-cols-2 gap-3">
                {([["State", place?.state], ["Country", place?.country]] as const).map(([label, v]) => (
                  <div key={label} className="rounded-2xl border border-slate-800/80 bg-slate-950/90 p-3.5">
                    <span className="mb-1 block text-[10px] font-extrabold uppercase text-slate-500">{label}</span>
                    <span className="text-sm font-bold text-emerald-400">{v ?? "--"}</span>
                  </div>
                ))}
              </div>
              {telemetry.accuracy != null && telemetry.accuracy > 200 && (
                <p className="text-[10px] text-amber-400">Low-accuracy fix (±{Math.round(telemetry.accuracy)} m). Open this on a phone with GPS for house-level precision.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.map(([label, value, sub]) => (
                <div key={label} className="glass-card rounded-2xl p-3.5">
                  <p className="mb-1 text-xs text-slate-400">{label}</p>
                  <p className="font-mono text-sm font-bold text-slate-100">{value}</p>
                  {sub && <span className="block font-mono text-[10px] text-slate-500">{sub}</span>}
                </div>
              ))}
            </div>

            <div className="glass-card space-y-3 rounded-2xl p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Settings</span>
              {([["Enable High Precision GPS", highAccuracy, setHighAccuracy], ["Auto-Center Map on Movement", follow, setFollow]] as const).map(([label, val, set]) => (
                <label key={label} className="flex cursor-pointer items-center justify-between text-xs text-slate-300">
                  <span>{label}</span>
                  <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-blue-600" />
                </label>
              ))}
              <p className="text-[10px] text-slate-500">Your position is shown live. Start Live Tracking to record the route.</p>
            </div>

            <div className="space-y-2 pt-1">
              <button onClick={tracking ? pause : start} className={`flex w-full items-center justify-center space-x-2 rounded-2xl px-4 py-3.5 font-bold text-white shadow-xl transition ${tracking ? "bg-amber-600 shadow-amber-600/25 hover:bg-amber-500" : "bg-blue-600 shadow-blue-600/25 hover:bg-blue-500"}`}>
                {tracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{tracking ? "Pause Tracking" : startTime.current ? "Resume Tracking" : "Start Live Tracking"}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={reset} className="flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" /><span>Reset Path</span></button>
                <button onClick={exportGeoJSON} className="flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"><Download className="h-3.5 w-3.5" /><span>Export GeoJSON</span></button>
              </div>
            </div>
          </div>

          {/* Map + log */}
          <div className="space-y-4 lg:col-span-7 xl:col-span-8">
            <div className="glass-card relative h-[480px] overflow-hidden rounded-3xl shadow-2xl lg:h-[520px]">
              <div ref={mapEl} className="h-full w-full" />
              <div className="glass-card absolute right-4 top-4 z-[1000] flex items-center space-x-1 rounded-2xl p-1">
                {(["dark", "street"] as const).map((k) => (
                  <button key={k} onClick={() => setLayer(k)} className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${layer === k ? "bg-blue-600 text-slate-200" : "text-slate-400 hover:text-slate-200"}`}>{k}</button>
                ))}
              </div>
              <button onClick={() => marker.current && map.current?.setView(marker.current.getLatLng(), 18, { animate: true })} title="Center Map on Me" className="glass-card absolute bottom-6 right-4 z-[1000] flex h-11 w-11 items-center justify-center rounded-2xl text-blue-400 transition hover:bg-slate-800 active:scale-95">
                <Crosshair className="h-5 w-5" />
              </button>
            </div>

            <div className="glass-card rounded-3xl p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Motion History Breadcrumbs</span>
                <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-500">{logs.length} records</span>
              </div>
              <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/60 p-2">
                <table className="w-full text-left font-mono text-[11px] text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-800 text-[9px] font-extrabold uppercase text-slate-500">
                      <th className="pb-2 pl-2">Time</th><th className="pb-2">Latitude</th><th className="pb-2">Longitude</th><th className="pb-2">Speed</th><th className="pb-2 pr-2 text-right">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr><td colSpan={5} className="py-4 text-center font-sans italic text-slate-600">No movement points logged yet. Start tracking to record route history.</td></tr>
                    ) : logs.map((r, i) => (
                      <tr key={i} className="border-b border-slate-800/60 transition hover:bg-slate-900/50">
                        <td className="py-1.5 pl-2 text-slate-300">{r.time}</td>
                        <td className="py-1.5 text-blue-400">{r.lat.toFixed(5)}</td>
                        <td className="py-1.5 text-blue-400">{r.lng.toFixed(5)}</td>
                        <td className="py-1.5 text-amber-400">{r.speed && r.speed > 0 ? `${(r.speed * 3.6).toFixed(1)} km/h` : "0.0"}</td>
                        <td className="py-1.5 pr-2 text-right text-emerald-400">±{Math.round(r.accuracy)}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}