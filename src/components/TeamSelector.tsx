"use client";

import { useState } from "react";
import Image from "next/image";
import { TEAMS } from "@/lib/teams";

export function TeamSelector({ onSelect }: { onSelect: (id: number) => void }) {
  const [selected, setSelected] = useState<number | "">("");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-[#F3F0FA] via-[#FFF5F7] to-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-[#7A4AED]/10 flex items-center justify-center">
            <Image src="/logos/venturelab.svg" alt="VentureLab" width={56} height={56} priority unoptimized />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-[#1A1035] tracking-tight">Road-to-Business</h1>
          <p className="text-sm text-[#7C6FA0] mt-1.5">Lundi 13 avril 2026 · Liege</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-[#7A4AED]/5 border border-[#E8E2F4]/50 space-y-5">
          <label className="text-xs font-semibold text-[#7C6FA0] uppercase tracking-widest block text-center">
            Selectionne ton equipe
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value ? parseInt(e.target.value) : "")}
            className="w-full h-12 px-4 rounded-xl border border-[#E8E2F4] bg-[#FAFAFE] text-[#1A1035] text-sm font-medium shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#7A4AED]/30 focus:border-[#7A4AED]/40 cursor-pointer transition-all"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237C6FA0' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
          >
            <option value="">Choisir une equipe...</option>
            {TEAMS.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} — {team.accompanist}
              </option>
            ))}
          </select>

          <button
            onClick={() => { if (selected !== "") onSelect(selected as number); }}
            disabled={selected === ""}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7A4AED] to-[#9B73F2] text-white text-sm font-bold shadow-lg shadow-[#7A4AED]/25 disabled:opacity-30 disabled:shadow-none active:scale-[0.98] transition-all"
          >
            Commencer
          </button>
        </div>

        <p className="text-[10px] text-[#7C6FA0]/40 text-center">
          RTB Companion · VentureLab 2026
        </p>
      </div>
    </div>
  );
}
