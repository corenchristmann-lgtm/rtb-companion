"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { TEAMS } from "@/lib/teams";
import { LOCATIONS, ATELIER_TO_LOCATION, TEAM_COLORS, LIEGE_CENTER, DEFAULT_ZOOM } from "@/lib/mapData";
import { loadAllRoutes, interpolateAlongRoute } from "@/lib/routes";
import type { RoutesMap } from "@/lib/routes";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

const EVENT_DATE = "2026-04-13";

function timeToSeconds(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}

interface TeamPosition {
  teamId: number;
  teamName: string;
  color: string;
  lat: number;
  lng: number;
  status: string;
}

function getTeamPosition(team: typeof TEAMS[0], nowSeconds: number, routes: RoutesMap): TeamPosition {
  const color = TEAM_COLORS[(team.id - 1) % TEAM_COLORS.length];

  for (let i = 0; i < team.schedule.length; i++) {
    const slot = team.schedule[i];
    const locId = ATELIER_TO_LOCATION[slot.atelier_id];
    const loc = LOCATIONS[locId];
    const start = timeToSeconds(slot.start_time);
    const end = timeToSeconds(slot.end_time);

    // Before first challenge
    if (i === 0 && nowSeconds < start) {
      return { teamId: team.id, teamName: team.name, color, lat: loc.lat, lng: loc.lng, status: `En attente — ${loc.company}` };
    }

    // During this challenge
    if (nowSeconds >= start && nowSeconds < end) {
      return { teamId: team.id, teamName: team.name, color, lat: loc.lat, lng: loc.lng, status: `Chez ${loc.company}` };
    }

    // In transit to next
    if (i < team.schedule.length - 1) {
      const nextSlot = team.schedule[i + 1];
      const nextLocId = ATELIER_TO_LOCATION[nextSlot.atelier_id];
      const nextLoc = LOCATIONS[nextLocId];
      const nextStart = timeToSeconds(nextSlot.start_time);

      if (nowSeconds >= end && nowSeconds < nextStart) {
        const progress = (nowSeconds - end) / (nextStart - end);

        // Use real route if available
        const routeKey = `${locId}->${nextLocId}`;
        const route = routes[routeKey];
        if (route && route.length > 1) {
          const [lat, lng] = interpolateAlongRoute(route, progress);
          return { teamId: team.id, teamName: team.name, color, lat, lng, status: `En route vers ${nextLoc.company}` };
        }

        // Fallback: linear interpolation
        const lat = loc.lat + (nextLoc.lat - loc.lat) * progress;
        const lng = loc.lng + (nextLoc.lng - loc.lng) * progress;
        return { teamId: team.id, teamName: team.name, color, lat, lng, status: `En route vers ${nextLoc.company}` };
      }
    }
  }

  // After last challenge
  const lastSlot = team.schedule[team.schedule.length - 1];
  const lastLocId = ATELIER_TO_LOCATION[lastSlot.atelier_id];
  const lastLoc = LOCATIONS[lastLocId];
  return { teamId: team.id, teamName: team.name, color, lat: lastLoc.lat, lng: lastLoc.lng, status: "Journee terminee" };
}

interface Props {
  currentTeamId: number;
}

export function MapScreen({ currentTeamId }: Props) {
  const [leafletReady, setLeafletReady] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [routes, setRoutes] = useState<RoutesMap>({});
  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [positions, setPositions] = useState<TeamPosition[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Simulation mode: accelerate time through the event day
  const [simulating, setSimulating] = useState(false);
  const [simSeconds, setSimSeconds] = useState(8 * 3600 + 30 * 60); // Start at 08:30
  const simTimeLabel = `${String(Math.floor(simSeconds / 3600)).padStart(2, "0")}:${String(Math.floor((simSeconds % 3600) / 60)).padStart(2, "0")}`;

  // Load leaflet CSS + module
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    import("leaflet").then((leaflet) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setL(leaflet);
      setLeafletReady(true);
    });

    return () => { document.head.removeChild(link); };
  }, []);

  // Load OSRM routes (cached in localStorage)
  useEffect(() => {
    loadAllRoutes().then((r) => {
      setRoutes(r);
      setRoutesLoaded(true);
    });
  }, []);

  // Update positions every 30s (or every 100ms in simulation)
  const updatePositions = useCallback((overrideSec?: number) => {
    if (overrideSec !== undefined) {
      setPositions(TEAMS.map((t) => getTeamPosition(t, overrideSec, routes)));
      return;
    }

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isEventDay = today === EVENT_DATE;

    if (!isEventDay && !simulating) {
      const pos = TEAMS.map((t) => {
        const firstLocId = ATELIER_TO_LOCATION[t.schedule[0].atelier_id];
        const loc = LOCATIONS[firstLocId];
        return { teamId: t.id, teamName: t.name, color: TEAM_COLORS[(t.id - 1) % TEAM_COLORS.length], lat: loc.lat, lng: loc.lng, status: `Premier arret : ${loc.company}` };
      });
      setPositions(pos);
      return;
    }

    const nowSec = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    setPositions(TEAMS.map((t) => getTeamPosition(t, nowSec, routes)));
  }, [routes, simulating]);

  // Normal refresh
  useEffect(() => {
    if (simulating) return;
    updatePositions();
    const interval = setInterval(updatePositions, 30000);
    return () => clearInterval(interval);
  }, [updatePositions, simulating]);

  // Simulation tick: advance 1 min every 100ms (= 1 hour in ~6 seconds)
  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(() => {
      setSimSeconds((prev) => {
        const next = prev + 60; // +1 minute per tick
        if (next > 18 * 3600 + 30 * 60) { // Stop at 18:30
          setSimulating(false);
          return 8 * 3600 + 30 * 60;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [simulating]);

  // Update positions when sim time changes
  useEffect(() => {
    if (simulating) {
      updatePositions(simSeconds);
    }
  }, [simSeconds, simulating, updatePositions]);

  if (!leafletReady || !L) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#7C6FA0] animate-pulse">Chargement de la carte...</p>
      </div>
    );
  }

  const activeTeamId = selectedTeam ?? currentTeamId;

  function teamIcon(pos: TeamPosition, isActive: boolean) {
    const num = pos.teamId;
    const size = isActive ? 28 : 22;
    return new L!.DivIcon({
      className: "",
      html: `<div style="
        width: ${size}px; height: ${size}px;
        background: ${pos.color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: ${isActive ? "11px" : "9px"}; font-weight: 800;
        transform: translate(-50%, -50%);
        animation: teamPulse 2s ease-in-out infinite;
      ">${num}</div>
      <style>
        @keyframes teamPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 ${pos.color}40; }
          50% { opacity: 0.85; box-shadow: 0 0 0 6px ${pos.color}00; }
        }
      </style>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Team selector chips */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {TEAMS.map((t) => {
            const isSelected = t.id === activeTeamId;
            const color = TEAM_COLORS[(t.id - 1) % TEAM_COLORS.length];
            return (
              <button key={t.id} onClick={() => setSelectedTeam(t.id === activeTeamId && t.id !== currentTeamId ? null : t.id)}
                className={`shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected ? "text-white shadow-sm" : "bg-[#F3F0FA] text-[#7C6FA0]"
                }`}
                style={isSelected ? { backgroundColor: color } : undefined}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isSelected ? "white" : color }} />
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation controls */}
      <div className="px-4 pb-1">
        <div className="flex items-center gap-2">
          <button onClick={() => { setSimulating(!simulating); if (!simulating) setSimSeconds(8 * 3600 + 30 * 60); }}
            className={`h-8 px-3 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
              simulating ? "bg-[#F46277] text-white" : "bg-[#F3F0FA] text-[#7A4AED]"
            }`}>
            {simulating ? "⏹ Stop" : "▶ Simulation"}
          </button>
          {simulating && (
            <div className="flex-1 rounded-lg bg-[#F3F0FA] px-3 h-8 flex items-center justify-center">
              <p className="text-sm font-bold text-[#7A4AED] tabular-nums">{simTimeLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      {(() => {
        const pos = positions.find((p) => p.teamId === activeTeamId);
        if (!pos) return null;
        return (
          <div className="px-4 pb-2">
            <div className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: pos.color + "15" }}>
              <p className="text-xs font-semibold" style={{ color: pos.color }}>
                {pos.teamName} — {pos.status}
                {!routesLoaded && " (chargement itineraires...)"}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={LIEGE_CENTER} zoom={DEFAULT_ZOOM} className="w-full h-full z-0"
          scrollWheelZoom={true} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Workshop markers */}
          {Object.values(LOCATIONS).map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <strong>{loc.company}</strong><br />
                {loc.address}
              </Popup>
            </Marker>
          ))}

          {/* Team position dots */}
          {positions.map((pos) => {
            const isActive = pos.teamId === activeTeamId;
            return (
              <Marker key={pos.teamId}
                position={[pos.lat, pos.lng]}
                icon={teamIcon(pos, isActive)}
                zIndexOffset={isActive ? 1000 : 0}
                eventHandlers={{ click: () => setSelectedTeam(pos.teamId) }}>
                <Popup>
                  <strong>{pos.teamName}</strong><br />
                  {pos.status}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
