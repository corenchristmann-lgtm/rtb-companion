"use client";

import { TEAMS } from "@/lib/teams";

export function TeamSelector({ onSelect }: { onSelect: (id: number) => void }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-[#FAFAFA]">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1035]">Road-to-Business</h1>
          <p className="text-sm text-[#7C6FA0] mt-1">Lundi 13 avril 2026 · VentureLab</p>
        </div>

        {/* Team selection */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#7C6FA0] uppercase tracking-widest text-center">Sélectionne ton équipe</p>
          <div className="space-y-2">
            {TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => onSelect(team.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E8E2F4] bg-white shadow-sm active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F0FA] flex items-center justify-center text-sm font-bold text-[#7A4AED] shrink-0">
                  {team.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1035]">{team.name}</p>
                  <p className="text-[11px] text-[#7C6FA0]">
                    {team.accompanist} · {team.projects.length} projets · {team.projects.reduce((n, p) => n + p.members.length, 0)} incubés
                  </p>
                </div>
                <span className="text-[#7C6FA0]/30">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-[#7C6FA0]/50 text-center">
          Companion app pour accompagnateurs RTB
        </p>
      </div>
    </div>
  );
}
