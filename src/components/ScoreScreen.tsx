"use client";

import { useState } from "react";
import { CHALLENGES, PROJECTS } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import type { Note } from "@/types/database";

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
}

export function ScoreScreen({ timer }: Props) {
  const [selectedChallenge, setSelectedChallenge] = useState(timer.challenge.id);
  const { notes, upsertNote } = useNotes();
  const ch = CHALLENGES.find((c) => c.id === selectedChallenge)!;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-lg font-bold">Noter</h1>

      {/* Challenge pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {CHALLENGES.map((c) => {
          const isSelected = selectedChallenge === c.id;
          const hasNotes = notes.some((n) => n.challenge_id === c.id && n.score);
          return (
            <button key={c.id} onClick={() => setSelectedChallenge(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#7A4AED] text-white shadow-lg shadow-[#7A4AED]/20"
                  : hasNotes
                  ? "bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399]"
                  : "bg-[#1A1927] border border-[#2E2B45] text-muted-foreground"
              }`}>
              <span>{c.emoji}</span>
              <span className="max-w-[60px] truncate">{c.company.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Context */}
      <p className="text-[11px] text-muted-foreground px-1">{ch.emoji} {ch.company} · {ch.format}</p>

      {/* Score cards */}
      <div className="space-y-2.5">
        {PROJECTS.map((p) => {
          const note = notes.find((n) => n.project_id === p.id && n.challenge_id === selectedChallenge) ?? null;
          return (
            <ScoreCard key={p.id} project={p} challengeId={selectedChallenge} note={note} onUpdate={upsertNote} />
          );
        })}
      </div>
    </div>
  );
}

function ScoreCard({
  project, challengeId, note, onUpdate,
}: {
  project: (typeof PROJECTS)[number];
  challengeId: number;
  note: Note | null;
  onUpdate: (pid: number, cid: number, u: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = note?.score ?? 0;

  return (
    <div className="rounded-2xl border border-[#2E2B45] bg-[#1A1927] overflow-hidden">
      {/* Header + stars */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-[#7A4AED]/10 flex items-center justify-center text-xs font-bold text-[#7A4AED] shrink-0">
          {project.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{project.name}</p>
          <p className="text-[10px] text-muted-foreground">{project.members}</p>
        </div>
        <div className="flex shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => onUpdate(project.id, challengeId, { score: s === score ? null : s })}
              className={`w-8 h-8 flex items-center justify-center text-[15px] rounded-lg active:scale-90 transition-all ${
                s <= score ? "text-[#FBBF24]" : "text-[#2E2B45]"
              }`}>
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Expand */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-1.5 text-[10px] text-muted-foreground font-semibold border-t border-[#2E2B45] bg-[#232136]/50 transition-colors">
        {expanded ? "Masquer ▴" : "Détails ▾"}
      </button>

      {expanded && (
        <div className="px-4 py-3 space-y-2.5 border-t border-[#2E2B45] animate-slide-up">
          <textarea value={note?.free_notes ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { free_notes: e.target.value })}
            placeholder="Notes libres…" rows={2}
            className="w-full px-3 py-2 bg-[#232136] rounded-xl text-sm leading-relaxed placeholder:text-muted-foreground/25 focus:outline-none focus:ring-1 focus:ring-[#7A4AED]/30 resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-[#34D399]/60 uppercase tracking-widest block mb-0.5">Point fort</label>
              <input type="text" value={note?.strength ?? ""}
                onChange={(e) => onUpdate(project.id, challengeId, { strength: e.target.value })}
                placeholder="Force…"
                className="w-full h-8 px-2.5 bg-[#232136] rounded-lg text-xs placeholder:text-muted-foreground/25 focus:outline-none focus:ring-1 focus:ring-[#34D399]/25" />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#F46277]/60 uppercase tracking-widest block mb-0.5">Amélioration</label>
              <input type="text" value={note?.improvement ?? ""}
                onChange={(e) => onUpdate(project.id, challengeId, { improvement: e.target.value })}
                placeholder="Axe…"
                className="w-full h-8 px-2.5 bg-[#232136] rounded-lg text-xs placeholder:text-muted-foreground/25 focus:outline-none focus:ring-1 focus:ring-[#F46277]/25" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
