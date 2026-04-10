"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { TEAMS } from "@/lib/teams";
import { LOCATIONS, ATELIER_TO_LOCATION, TEAM_COLORS, LIEGE_CENTER, DEFAULT_ZOOM } from "@/lib/mapData";
import type { MapLocation } from "@/lib/mapData";

// Leaflet must be loaded client-side only
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then(m => m.Tooltip), { ssr: false });

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
  status: string; // "Chez BNP", "En route vers UCM", etc.
}

// Calculate where a team theoretically is right now
function getTeamPosition(team: typeof TEAMS[0], nowSeconds: number): TeamPosition {
  const color = TEAM_COLORS[(team.id - 1) % TEAM_COLORS.length];

  for (let i = 0; i < team.schedule.length; i++) {
    const slot = team.schedule[i];
    const locId = ATELIER_TO_LOCATION[slot.atelier_id];
    const loc = LOCATIONS[locId];
    const start = timeToSeconds(slot.start_time);
    const end = timeToSeconds(slot.end_time);

    // Before first challenge
    if (i === 0 && nowSeconds < start) {
      return { teamId: team.id, teamName: team.name, color, lat: loc.lat, lng: loc.lng, status: `En attente devant ${loc.company}` };
    }

    // During this challenge
    if (nowSeconds >= start && nowSeconds < end) {
      return { teamId: team.id, teamName: team.name, color, lat: loc.lat, lng: loc.lng, status: `Chez ${loc.company}` };
    }

    // Between this challenge and the next
    if (i < team.schedule.length - 1) {
      const nextSlot = team.schedule[i + 1];
      const nextLocId = ATELIER_TO_LOCATION[nextSlot.atelier_id];
      const nextLoc = LOCATIONS[nextLocId];
      const nextStart = timeToSeconds(nextSlot.start_time);

      if (nowSeconds >= end && nowSeconds < nextStart) {
        // Interpolate position between the two locations
        const progress = (nowSeconds - end) / (nextStart - end);
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

// OSRM route fetching with localStorage cache
async function fetchRoute(from: MapLocation, to: MapLocation): Promise<[number, number][]> {
  const cacheKey = `rtb-route-${from.id}-${to.id}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      );
      localStorage.setItem(cacheKey, JSON.stringify(coords));
      return coords;
    }
  } catch {}

  // Fallback: straight line
  return [[from.lat, from.lng], [to.lat, to.lng]];
}

// Get all unique route pairs needed
function getRoutePairs(): [string, string][] {
  const pairs = new Set<string>();
  for (const team of TEAMS) {
    for (let i = 0; i < team.schedule.length - 1; i++) {
      const fromLoc = ATELIER_TO_LOCATION[team.schedule[i].atelier_id];
      const toLoc = ATELIER_TO_LOCATION[team.schedule[i + 1].atelier_id];
      if (fromLoc !== toLoc) {
        const key = [fromLoc, toLoc].sort().join("-");
        if (!pairs.has(key)) pairs.add(key);
      }
    }
  }
  return [...pairs].map(k => k.split("-") as [string, string]);
}

interface Props {
  currentTeamId: number;
}

export function MapScreen({ currentTeamId }: Props) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [routes, setRoutes] = useState<Record<string, [number, number][]>>({});
  const [positions, setPositions] = useState<TeamPosition[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [now, setNow] = useState(() => new Date());

  // Load leaflet CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Fix default marker icons
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletLoaded(true);
    });

    return () => { document.head.removeChild(link); };
  }, []);

  // Fetch all routes
  useEffect(() => {
    const pairs = getRoutePairs();
    Promise.all(
      pairs.map(async ([a, b]) => {
        const route = await fetchRoute(LOCATIONS[a], LOCATIONS[b]);
        return { key: `${a}-${b}`, reverseKey: `${b}-${a}`, route };
      })
    ).then((results) => {
      const map: Record<string, [number, number][]> = {};
      for (const r of results) {
        map[r.key] = r.route;
        map[r.reverseKey] = [...r.route].reverse();
      }
      setRoutes(map);
    });
  }, []);

  // Update positions every 30s
  const updatePositions = useCallback(() => {
    const d = new Date();
    setNow(d);
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isEventDay = today === EVENT_DATE;

    if (!isEventDay) {
      // Before/after event: show all teams at their first location
      const pos = TEAMS.map((t) => {
        const firstLocId = ATELIER_TO_LOCATION[t.schedule[0].atelier_id];
        const loc = LOCATIONS[firstLocId];
        return { teamId: t.id, teamName: t.name, color: TEAM_COLORS[(t.id - 1) % TEAM_COLORS.length], lat: loc.lat, lng: loc.lng, status: `Premier arret : ${loc.company}` };
      });
      setPositions(pos);
      return;
    }

    const nowSec = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    setPositions(TEAMS.map((t) => getTeamPosition(t, nowSec)));
  }, []);

  useEffect(() => {
    updatePositions();
    const interval = setInterval(updatePositions, 30000);
    return () => clearInterval(interval);
  }, [updatePositions]);

  // Build route for selected team
  const selectedTeamRoute = useMemo(() => {
    const tid = selectedTeam ?? currentTeamId;
    const team = TEAMS.find((t) => t.id === tid);
    if (!team) return [];

    const points: [number, number][] = [];
    for (let i = 0; i < team.schedule.length - 1; i++) {
      const fromLoc = ATELIER_TO_LOCATION[team.schedule[i].atelier_id];
      const toLoc = ATELIER_TO_LOCATION[team.schedule[i + 1].atelier_id];
      if (fromLoc === toLoc) continue;
      const routeKey = `${fromLoc}-${toLoc}`;
      const route = routes[routeKey];
      if (route) {
        points.push(...route);
      } else {
        points.push([LOCATIONS[fromLoc].lat, LOCATIONS[fromLoc].lng]);
        points.push([LOCATIONS[toLoc].lat, LOCATIONS[toLoc].lng]);
      }
    }
    return points;
  }, [selectedTeam, currentTeamId, routes]);

  if (!leafletLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#7C6FA0] animate-pulse">Chargement de la carte...</p>
      </div>
    );
  }

  const activeTeamId = selectedTeam ?? currentTeamId;

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

      {/* Status bar */}
      {(() => {
        const pos = positions.find((p) => p.teamId === activeTeamId);
        if (!pos) return null;
        return (
          <div className="px-4 pb-2">
            <div className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: pos.color + "15" }}>
              <p className="text-xs font-semibold" style={{ color: pos.color }}>{pos.teamName} — {pos.status}</p>
            </div>
          </div>
        );
      })()}

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={LIEGE_CENTER} zoom={DEFAULT_ZOOM} className="w-full h-full z-0"
          scrollWheelZoom={true} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

          {/* Selected team route */}
          {selectedTeamRoute.length > 1 && (
            <Polyline
              positions={selectedTeamRoute}
              pathOptions={{ color: TEAM_COLORS[(activeTeamId - 1) % TEAM_COLORS.length], weight: 3, opacity: 0.5, dashArray: "8 6" }}
            />
          )}

          {/* Team position dots */}
          {positions.map((pos) => {
            const isActive = pos.teamId === activeTeamId;
            return (
              <CircleMarker key={pos.teamId}
                center={[pos.lat, pos.lng]}
                radius={isActive ? 10 : 6}
                pathOptions={{
                  color: "white",
                  weight: isActive ? 3 : 2,
                  fillColor: pos.color,
                  fillOpacity: isActive ? 1 : 0.7,
                }}
                eventHandlers={{ click: () => setSelectedTeam(pos.teamId) }}>
                <Tooltip permanent={isActive} direction="top" offset={[0, -10]}
                  className="!bg-transparent !border-0 !shadow-none !p-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: pos.color }}>
                    {pos.teamName.replace("Équipe ", "Éq.")}
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
