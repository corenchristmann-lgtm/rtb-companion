// GPS coordinates for each workshop location in Liege
// Verified via OpenStreetMap / Nominatim

export interface MapLocation {
  id: string;
  company: string;
  lat: number;
  lng: number;
  address: string;
  color: string;
}

export const LOCATIONS: Record<string, MapLocation> = {
  bnp: { id: "bnp", company: "BNP Paribas Fortis", lat: 50.6428, lng: 5.5712, address: "Place Xavier Neujean 2", color: "#00965E" },
  ucm: { id: "ucm", company: "UCM", lat: 50.6381, lng: 5.5665, address: "Boulevard d'Avroy 42", color: "#E30613" },
  we: { id: "we", company: "Wallonie Entreprendre", lat: 50.6368, lng: 5.5628, address: "Avenue Maurice Destenay 13", color: "#F5A623" },
  loterie: { id: "loterie", company: "Loterie Nationale", lat: 50.6332, lng: 5.5590, address: "Avenue Blonden 84", color: "#D4145A" },
  evs: { id: "evs", company: "EVS", lat: 50.6130, lng: 5.5270, address: "Rue du Bois Saint-Jean 13, Seraing", color: "#0065B3" },
  defenso: { id: "defenso", company: "Defenso", lat: 50.6235, lng: 5.5808, address: "Place George Ista 28, Grivegnee", color: "#2D3748" },
  vl: { id: "vl", company: "VentureLab (AKT + VEDIA)", lat: 50.6420, lng: 5.5735, address: "Rue des Carmes 24", color: "#7A4AED" },
};

// Map atelier IDs to location IDs (akt and vedia share vl)
export const ATELIER_TO_LOCATION: Record<string, string> = {
  bnp: "bnp",
  ucm: "ucm",
  we: "we",
  loterie: "loterie",
  evs: "evs",
  defenso: "defenso",
  akt: "vl",
  vedia: "vl",
};

// Team colors for map markers
export const TEAM_COLORS = [
  "#7A4AED", // Eq 1
  "#E30613", // Eq 2
  "#00965E", // Eq 3
  "#F5A623", // Eq 4
  "#0065B3", // Eq 5
  "#D4145A", // Eq 6
  "#2D3748", // Eq 7
  "#00B4D8", // Eq 8
  "#FF6B35", // Eq 9
];

// Liege center for initial map view
export const LIEGE_CENTER: [number, number] = [50.6340, 5.5650];
export const DEFAULT_ZOOM = 14;
