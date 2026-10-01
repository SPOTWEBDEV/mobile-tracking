'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Layers, Navigation, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface TelemetryData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  altitude: number | null;
  timestamp: string;
}

interface PulseMapProps {
  onTelemetryUpdate: (data: TelemetryData) => void;
  selectedTile: 'dark' | 'street' | 'satellite';
}

export default function PulseMap({ onTelemetryUpdate, selectedTile }: PulseMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [isLive, setIsLive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  // Map Tile Endpoints
  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // Initialize Map
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([6.5244, 3.3792], 13); // Default view

          tileLayerRef.current = L.tileLayer(tileUrls[selectedTile], {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
          }).addTo(map);

          // Add Zoom control to bottom right
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          // Movement trail polyline
          polylineRef.current = L.polyline([], {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.85,
          }).addTo(map);

          mapRef.current = map;
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Tile Layer Switch
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      import('leaflet').then((L) => {
        mapRef.current.removeLayer(tileLayerRef.current);
        tileLayerRef.current = L.tileLayer(tileUrls[selectedTile], {
          maxZoom: 19,
        }).addTo(mapRef.current);
      });
    }
  }, [selectedTile]);

  // Start Real-Time Geolocation Engine
  const toggleTracking = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your device browser.');
      return;
    }

    if (isLive) {
      setIsLive(false);
      return;
    }

    setIsLive(true);
    setErrorMsg(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, altitude } = position.coords;
        const newPoint: [number, number] = [latitude, longitude];

        setCoordinates((prev) => [...prev, newPoint]);

        const telemetry = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          speed: speed ? Math.round(speed * 3.6) : 0, // Convert m/s to km/h
          altitude: altitude ? Math.round(altitude) : null,
          timestamp: new Date().toLocaleTimeString(),
        };

        onTelemetryUpdate(telemetry);

        import('leaflet').then((L) => {
          if (mapRef.current) {
            mapRef.current.setView(newPoint, 16);

            // Custom Glowing Marker Icon
            if (!markerRef.current) {
              const pulseIcon = L.divIcon({
                className: 'custom-pulse-marker',
                html: `<div class="relative flex items-center justify-center w-8 h-8">
                        <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                        <div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              });

              markerRef.current = L.marker(newPoint, { icon: pulseIcon }).addTo(mapRef.current);
            } else {
              markerRef.current.setLatLng(newPoint);
            }

            // Accuracy Range Circle
            if (!circleRef.current) {
              circleRef.current = L.circle(newPoint, {
                radius: accuracy,
                color: '#3b82f6',
                fillColor: '#60a5fa',
                fillOpacity: 0.15,
                weight: 1,
              }).addTo(mapRef.current);
            } else {
              circleRef.current.setLatLng(newPoint);
              circleRef.current.setRadius(accuracy);
            }

            // Polyline Trail
            if (polylineRef.current) {
              polylineRef.current.addLatLng(newPoint);
            }
          }
        });
      },
      (err) => {
        setErrorMsg(err.message || 'Failed to capture GPS signal.');
        setIsLive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={toggleTracking}
          className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl transition-all ${
            isLive 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
          }`}
        >
          {isLive ? (
            <>
              <Pause className="w-4 h-4 fill-current" /> Pause Live Tracking
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Start Live Tracking
            </>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-red-950/90 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2 shadow-lg backdrop-blur-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}