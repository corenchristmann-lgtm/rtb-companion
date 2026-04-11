// Fetch and cache real routes between workshop locations via OSRM
// For transit routes (tram/bus), we use intermediate waypoints to follow
// the actual path: walk to stop → ride along route → walk to destination
import { LOCATIONS, ATELIER_TO_LOCATION } from "./mapData";
import { TEAMS } from "./teams";

export type LatLng = [number, number];

// ── Key waypoints (bus/tram stops, stations) ──
const WAYPOINTS = {
  pontAvroy: [50.6393, 5.5687] as LatLng,       // Tram stop Pont d'Avroy
  guillemins: [50.6247, 5.5671] as LatLng,       // Gare des Guillemins
  sartTilmanPoly: [50.5840, 5.5604] as LatLng,   // Bus stop Sart-Tilman Polytech
  rueFalchena: [50.6240, 5.5945] as LatLng,      // Bus stop Rue du Falchena
  pontLongdoz: [50.6367, 5.5793] as LatLng,      // Pont de Longdoz (bus stop)
};

// ── Multi-modal route definitions ──
// For transit routes, we define waypoints the route must pass through.
// OSRM will compute the real road path between each pair of waypoints.
// The profile is specified per segment (foot for walking, driving for bus/tram roads).

interface RouteSegment {
  from: LatLng;
  to: LatLng;
  profile: "foot" | "driving";
}

// Special multi-modal routes with intermediate waypoints
// These override the default direct OSRM fetch for specific pairs
function getMultiModalSegments(fromId: string, toId: string): RouteSegment[] | null {
  const fromLoc = LOCATIONS[fromId];
  const toLoc = LOCATIONS[toId];
  const from: LatLng = [fromLoc.lat, fromLoc.lng];
  const to: LatLng = [toLoc.lat, toLoc.lng];

  // 1. Wallonie Entreprendre → Loterie Nationale
  // Walk to Pont d'Avroy → Tram T1 to Petit Paradis area → Walk to Loterie
  if (fromId === "we" && toId === "loterie") {
    return [
      { from, to: WAYPOINTS.pontAvroy, profile: "foot" },
      { from: WAYPOINTS.pontAvroy, to, profile: "driving" }, // tram follows road
    ];
  }
  // Reverse
  if (fromId === "loterie" && toId === "we") {
    return [
      { from, to: WAYPOINTS.pontAvroy, profile: "driving" },
      { from: WAYPOINTS.pontAvroy, to, profile: "foot" },
    ];
  }

  // 2. Loterie Nationale → EVS (bus via Guillemins + Sart-Tilman)
  // Walk to Guillemins → Bus B2 to Sart-Tilman Polytech → Walk to EVS
  if (fromId === "loterie" && toId === "evs") {
    return [
      { from, to: WAYPOINTS.guillemins, profile: "foot" },
      { from: WAYPOINTS.guillemins, to: WAYPOINTS.sartTilmanPoly, profile: "driving" },
      { from: WAYPOINTS.sartTilmanPoly, to, profile: "foot" },
    ];
  }
  // Reverse
  if (fromId === "evs" && toId === "loterie") {
    return [
      { from, to: WAYPOINTS.sartTilmanPoly, profile: "foot" },
      { from: WAYPOINTS.sartTilmanPoly, to: WAYPOINTS.guillemins, profile: "driving" },
      { from: WAYPOINTS.guillemins, to, profile: "foot" },
    ];
  }

  // 3. Defenso → VentureLab (bus via Falchena + Pont de Longdoz)
  // Walk to Falchena → Bus 17 to Pont de Longdoz → Walk to VentureLab
  if (fromId === "defenso" && toId === "vl") {
    return [
      { from, to: WAYPOINTS.rueFalchena, profile: "foot" },
      { from: WAYPOINTS.rueFalchena, to: WAYPOINTS.pontLongdoz, profile: "driving" },
      { from: WAYPOINTS.pontLongdoz, to, profile: "foot" },
    ];
  }
  // Reverse
  if (fromId === "vl" && toId === "defenso") {
    return [
      { from, to: WAYPOINTS.pontLongdoz, profile: "foot" },
      { from: WAYPOINTS.pontLongdoz, to: WAYPOINTS.rueFalchena, profile: "driving" },
      { from: WAYPOINTS.rueFalchena, to, profile: "foot" },
    ];
  }

  // 4. EVS → Defenso (voiture VentureLab)
  if (fromId === "evs" && toId === "defenso") {
    return [{ from, to, profile: "driving" }];
  }
  if (fromId === "defenso" && toId === "evs") {
    return [{ from, to, profile: "driving" }];
  }

  // Any route involving EVS that isn't covered above
  if (fromId === "evs" || toId === "evs") {
    return [{ from, to, profile: "driving" }];
  }

  // All other routes involving Defenso (walking in Grivegnee is far)
  if (fromId === "defenso" || toId === "defenso") {
    // Check if it's a long distance — use bus segments
    const dist = haversine(from, to);
    if (dist > 1500) {
      // Long distance to/from defenso — use driving profile to simulate bus
      return [{ from, to, profile: "driving" }];
    }
  }

  return null; // Use default foot routing
}

// ── OSRM fetching ──

async function fetchOSRMSegment(from: LatLng, to: LatLng, profile: "foot" | "driving"): Promise<LatLng[]> {
  const p = profile === "driving" ? "driving" : "foot";
  try {
    const url = `https://router.project-osrm.org/route/v1/${p}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as LatLng
      );
    }
  } catch {}
  return [from, to];
}

async function fetchRoute(fromId: string, toId: string): Promise<LatLng[]> {
  const multiModal = getMultiModalSegments(fromId, toId);

  if (multiModal) {
    // Fetch each segment and concatenate
    const allPoints: LatLng[] = [];
    for (const seg of multiModal) {
      const points = await fetchOSRMSegment(seg.from, seg.to, seg.profile);
      // Avoid duplicating the junction point
      if (allPoints.length > 0 && points.length > 0) {
        allPoints.push(...points.slice(1));
      } else {
        allPoints.push(...points);
      }
      await new Promise(r => setTimeout(r, 150));
    }
    return allPoints;
  }

  // Default: foot routing
  const from = LOCATIONS[fromId];
  const to = LOCATIONS[toId];
  return fetchOSRMSegment([from.lat, from.lng], [to.lat, to.lng], "foot");
}

// ── Get all needed route pairs ──

function getAllRoutePairs(): [string, string][] {
  const seen = new Set<string>();
  const pairs: [string, string][] = [];

  for (const team of TEAMS) {
    // Route from OPRL to first atelier
    const firstLocId = ATELIER_TO_LOCATION[team.schedule[0].atelier_id];
    const oprlKey = `oprl->${firstLocId}`;
    if (!seen.has(oprlKey)) {
      seen.add(oprlKey);
      pairs.push(["oprl", firstLocId]);
    }

    // Routes between ateliers
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

// ── Cache + load ──

const LS_KEY = "rtb-routes-cache-v4";

export type RoutesMap = Record<string, LatLng[]>;

export async function loadAllRoutes(): Promise<RoutesMap> {
  // Try cache
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as RoutesMap;
      if (Object.keys(parsed).length >= 10) return parsed;
    }
  } catch {}

  // Fetch all routes
  const pairs = getAllRoutePairs();
  const routes: RoutesMap = {};

  for (const [fromId, toId] of pairs) {
    const key = `${fromId}->${toId}`;
    routes[key] = await fetchRoute(fromId, toId);
    await new Promise(r => setTimeout(r, 200));
  }

  try { localStorage.setItem(LS_KEY, JSON.stringify(routes)); } catch {}

  return routes;
}

// ── Interpolation along route ──

export function interpolateAlongRoute(route: LatLng[], progress: number): LatLng {
  if (route.length === 0) return [0, 0];
  if (route.length === 1 || progress <= 0) return route[0];
  if (progress >= 1) return route[route.length - 1];

  const distances: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < route.length; i++) {
    totalDist += haversine(route[i - 1], route[i]);
    distances.push(totalDist);
  }

  if (totalDist === 0) return route[0];

  const targetDist = progress * totalDist;

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
