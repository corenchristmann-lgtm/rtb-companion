"use client";

import { useState } from "react";
import Image from "next/image";
import { TEAMS } from "@/lib/teams";

export function TeamSelector({ onSelect }: { onSelect: (id: number) => void }) {
  const [selected, setSelected] = useState<number | "">("");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-[#FFF5F7]">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logos/venturelab.svg" alt="VentureLab" width={180} height={60} priority unoptimized />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1035]">Road-to-Business</h1>
          <p className="text-sm text-[#7C6FA0] mt-1">Lundi 13 avril 2026 · Liège</p>
        </div>

        {/* Dropdown */}
        <div className="space-y-4">
          <label className="text-xs font-semibold text-[#7C6FA0] uppercase tracking-widest block text-center">
            Sélectionne ton équipe
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value ? parseInt(e.target.value) : "")}
            className="w-full h-12 px-4 rounded-2xl border border-[#E8E2F4] bg-white text-[#1A1035] text-sm font-medium shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#7A4AED]/30 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237C6FA0' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
          >
            <option value="">Choisir une équipe…</option>
            {TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} — {team.accompanist} ({team.projects.length} projets, {team.projects.reduce((n, p) => n + p.members.length, 0)} incubés)
              </option>
            ))}
          </select>

          <button
            onClick={() => { if (selected !== "") onSelect(selected as number); }}
            disabled={selected === ""}
            className="w-full h-12 rounded-2xl bg-[#7A4AED] text-white text-sm font-semibold shadow-lg shadow-[#7A4AED]/25 disabled:opacity-30 active:scale-[0.98] transition-all"
          >
            Commencer
          </button>
        </div>

        <p className="text-[10px] text-[#7C6FA0]/50 text-center">
          Companion app pour accompagnateurs RTB
        </p>
      </div>
    </div>
  );
}
