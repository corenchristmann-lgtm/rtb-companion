"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useSupabase";
import type { Note } from "@/types/database";
import type { TeamProject } from "@/lib/teams";
import { CompanyLogo } from "./CompanyLogo";

interface Challenge {
  id: number; position: number; company: string; emoji: string | null;
  format: string;
}

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  challenges: Challenge[];
  projects: TeamProject[];
}

export function ScoreScreen({ timer, challenges, projects }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(timer.currentChallengeIndex);
  const { notes, upsertNote } = useNotes();
  const ch = challenges[selectedIdx];
  if (!ch) return null;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-lg font-bold text-[#1A1035]">Noter</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {challenges.map((c, i) => {
          const isSelected = selectedIdx === i;
          const hasNotes = notes.some((n) => n.challenge_id === c.id && n.score);
          return (
            <button key={c.id} onClick={() => setSelectedIdx(i)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected ? "bg-[#7A4AED] text-white shadow-lg shadow-[#7A4AED]/25" :
                hasNotes ? "bg-emerald-50 border border-emerald-200 text-emerald-700" :
                "bg-white border border-[#E8E2F4] text-[#7C6FA0] shadow-sm"
              }`}>
              <CompanyLogo src={c.emoji ?? ""} company={c.company} size={20} />
              <span className="max-w-[60px] truncate">{c.company.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[#7C6FA0] px-1">{ch.company} · {ch.format}</p>

      <div className="space-y-2.5">
        {projects.map((p) => {
          const note = notes.find((n) => n.project_id === p.db_id && n.challenge_id === ch.id) ?? null;
          return <ScoreCard key={p.db_id} project={p} projectId={p.db_id} challengeId={ch.id} note={note} onUpdate={upsertNote} />;
        })}
      </div>
    </div>
  );
}

function ScoreCard({ project, projectId, challengeId, note, onUpdate }: {
  project: TeamProject; projectId: number; challengeId: number;
  note: Note | null;
  onUpdate: (pid: number, cid: number, u: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = note?.score ?? 0;

  return (
    <div className="rounded-2xl border border-[#E8E2F4] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-[#F3F0FA] flex items-center justify-center text-xs font-bold text-[#7A4AED] shrink-0">
          {project.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1035] truncate">{project.name}</p>
          <p className="text-[10px] text-[#7C6FA0]">{project.members.join(", ")}</p>
        </div>
        <div className="flex shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => onUpdate(projectId, challengeId, { score: s === score ? null : s })}
              className={`w-8 h-8 flex items-center justify-center text-[15px] rounded-lg active:scale-90 transition-all ${
                s <= score ? "text-amber-400" : "text-gray-200"
              }`}>★</button>
          ))}
        </div>
      </div>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-1.5 text-[10px] text-[#7C6FA0] font-semibold border-t border-[#E8E2F4] bg-[#FFF5F7]">
        {expanded ? "Masquer ▴" : "Détails ▾"}
      </button>
      {expanded && (
        <div className="px-4 py-3 space-y-2.5 border-t border-[#E8E2F4] animate-slide-up">
          <textarea value={note?.free_notes ?? ""}
            onChange={(e) => onUpdate(projectId, challengeId, { free_notes: e.target.value })}
            placeholder="Notes libres…" rows={2}
            className="w-full px-3 py-2 bg-[#F3F0FA] rounded-xl text-sm leading-relaxed placeholder:text-[#7C6FA0]/30 focus:outline-none focus:ring-1 focus:ring-[#7A4AED]/30 resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block mb-0.5">Point fort</label>
              <input type="text" value={note?.strength ?? ""}
                onChange={(e) => onUpdate(projectId, challengeId, { strength: e.target.value })}
                placeholder="Force…" className="w-full h-8 px-2.5 bg-emerald-50 rounded-lg text-xs placeholder:text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#F46277] uppercase tracking-widest block mb-0.5">Amélioration</label>
              <input type="text" value={note?.improvement ?? ""}
                onChange={(e) => onUpdate(projectId, challengeId, { improvement: e.target.value })}
                placeholder="Axe…" className="w-full h-8 px-2.5 bg-[#FFE3E8] rounded-lg text-xs placeholder:text-[#F46277]/30 focus:outline-none focus:ring-1 focus:ring-[#F46277]/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
