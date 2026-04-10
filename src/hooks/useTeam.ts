"use client";

import { useState, useEffect, useCallback } from "react";
import { TEAMS, ATELIERS } from "@/lib/teams";
import type { Team, ScheduleSlot, Atelier } from "@/lib/teams";

const STORAGE_KEY = "rtb-team-id";

export function useTeam() {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTeamId(parseInt(stored, 10));
    setLoaded(true);
  }, []);

  const selectTeam = useCallback((id: number) => {
    localStorage.setItem(STORAGE_KEY, String(id));
    setTeamId(id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTeamId(null);
  }, []);

  const team = teamId ? TEAMS.find((t) => t.id === teamId) ?? null : null;

  return { teamId, team, loaded, selectTeam, logout };
}

// Helper: get atelier details for a schedule slot
export function getAtelier(slot: ScheduleSlot): Atelier {
  return ATELIERS[slot.atelier_id];
}

// Stable IDs matching Supabase challenge_id for checklist/notes
const ATELIER_DB_ID: Record<string, number> = {
  bnp: 1, ucm: 2, we: 3, loterie: 4, evs: 5, defenso: 6, akt: 7, vedia: 8,
};

// Helper: build Challenge-like object from slot + atelier (for compatibility)
export function slotToChallenge(slot: ScheduleSlot, position: number) {
  const atelier = ATELIERS[slot.atelier_id];
  return {
    id: ATELIER_DB_ID[slot.atelier_id] ?? position,
    position,
    company: atelier.company,
    emoji: atelier.logo,
    start_time: slot.start_time,
    end_time: slot.end_time,
    location: atelier.address,
    address: atelier.address,
    challenge_description: atelier.challenge_description,
    format: atelier.format,
    skills: atelier.skills,
    tips: atelier.tips,
    briefing_notes: atelier.briefing_notes,
    jury: atelier.jury,
    contact_name: atelier.contact_name,
    contact_phone: atelier.contact_phone,
    prize: atelier.prize,
    transport_to_next: slot.transport_to_next,
    directions_url: slot.directions_url,
  };
}

// Build full challenge list for a team
export function teamChallenges(team: Team) {
  return team.schedule.map((slot, i) => slotToChallenge(slot, i + 1));
}
