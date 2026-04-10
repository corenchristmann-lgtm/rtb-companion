// Fetch and cache real walking/driving routes between workshop locations via OSRM
import { LOCATIONS, ATELIER_TO_LOCATION } from "./mapData";
import { TEAMS } from "./teams";

export type LatLng = [number, number];

// Get all unique directed pairs of locations needed across all teams
function getAllRoutePairs(): [string, string][] {
  const seen = new Set<string>();
  const pairs: [string, string][] = [];

  for (const team of TEAMS) {
    for (let i = 0; i < team.schedule.length - 1; i++) {
      const fromLoc = ATELIER_TO_LOCATION[team.schedule[i].atelier_id];
      const toLoc = ATELIER_TO_LOCATION[team.schedule[i + 1].atelier_id];
      if (fromLoc === toLoc) continue;
      const key = `${fromLoc}->${toLoc}`;
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push([fromLoc, toLoc]);
      }
    }
  }
  return pairs;
}

// Fetch a single route from OSRM
async function fetchOSRMRoute(fromId: string, toId: string, mode: "foot" | "car"): Promise<LatLng[]> {
  const from = LOCATIONS[fromId];
  const to = LOCATIONS[toId];
  const profile = mode === "car" ? "driving" : "foot";

  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as LatLng
      );
    }
  } catch {}

  // Fallback: straight line
  return [[from.lat, from.lng], [to.lat, to.lng]];
}

// Determine transport mode between two locations
function getRouteMode(fromId: string, toId: string): "foot" | "car" {
  // EVS (Seraing) requires car/bus — too far to walk
  if (fromId === "evs" || toId === "evs") return "car";
  // Defenso (Grivegnee) to/from distant points may need car
  if ((fromId === "defenso" && toId === "evs") || (fromId === "evs" && toId === "defenso")) return "car";
  return "foot";
}

const LS_KEY = "rtb-routes-cache-v2";

export type RoutesMap = Record<string, LatLng[]>;

// Load all routes: from cache or fetch from OSRM
export async function loadAllRoutes(): Promise<RoutesMap> {
  // Try cache first
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as RoutesMap;
      // Verify it has enough entries
      if (Object.keys(parsed).length >= 10) return parsed;
    }
  } catch {}

  // Fetch all routes
  const pairs = getAllRoutePairs();
  const routes: RoutesMap = {};

  // Fetch in small batches to avoid rate limiting
  for (const [fromId, toId] of pairs) {
    const mode = getRouteMode(fromId, toId);
    const key = `${fromId}->${toId}`;
    routes[key] = await fetchOSRMRoute(fromId, toId, mode);
    // Small delay to be nice to OSRM public server
    await new Promise(r => setTimeout(r, 200));
  }

  // Cache
  try { localStorage.setItem(LS_KEY, JSON.stringify(routes)); } catch {}

  return routes;
}

// Given a route (array of LatLng) and a progress (0..1), return the interpolated position
export function interpolateAlongRoute(route: LatLng[], progress: number): LatLng {
  if (route.length === 0) return [0, 0];
  if (route.length === 1 || progress <= 0) return route[0];
  if (progress >= 1) return route[route.length - 1];

  // Compute cumulative distances
  const distances: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < route.length; i++) {
    const d = haversine(route[i - 1], route[i]);
    totalDist += d;
    distances.push(totalDist);
  }

  if (totalDist === 0) return route[0];

  const targetDist = progress * totalDist;

  // Find the segment
  for (let i = 1; i < distances.length; i++) {
    if (distances[i] >= targetDist) {
      const segStart = distances[i - 1];
      const segEnd = distances[i];
      const segProgress = (targetDist - segStart) / (segEnd - segStart);
      const lat = route[i - 1][0] + (route[i][0] - route[i - 1][0]) * segProgress;
      const lng = route[i - 1][1] + (route[i][1] - route[i - 1][1]) * segProgress;
      return [lat, lng];
    }
  }

  return route[route.length - 1];
}

// Haversine distance in meters (for proportional interpolation)
function haversine(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const sin2Lat = Math.sin(dLat / 2) ** 2;
  const sin2Lng = Math.sin(dLng / 2) ** 2;
  const h = sin2Lat + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sin2Lng;
  return 2 * R * Math.asin(Math.sqrt(h));
}
