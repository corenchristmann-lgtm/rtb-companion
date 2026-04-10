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

      {/* Challenge selector — horizontal scroll pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {CHALLENGES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedChallenge(c.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedChallenge === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            <span>{c.emoji}</span>
            <span>{c.company.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Challenge context */}
      <div className="rounded-xl bg-secondary/50 px-3 py-2">
        <p className="text-xs text-muted-foreground">{ch.emoji} {ch.company} · {ch.format}</p>
      </div>

      {/* Project scoring cards */}
      <div className="space-y-3">
        {PROJECTS.map((p) => {
          const note = notes.find((n) => n.project_id === p.id && n.challenge_id === selectedChallenge) ?? null;
          return (
            <ProjectScoreCard
              key={p.id}
              project={p}
              challengeId={selectedChallenge}
              note={note}
              onUpdate={upsertNote}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProjectScoreCard({
  project,
  challengeId,
  note,
  onUpdate,
}: {
  project: (typeof PROJECTS)[number];
  challengeId: number;
  note: Note | null;
  onUpdate: (pid: number, cid: number, u: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = note?.score ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header: project name + quick stars */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {project.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{project.name}</p>
          <p className="text-[10px] text-muted-foreground">{project.members}</p>
        </div>
        {/* Inline star rating — always visible, tap to score */}
        <div className="flex gap-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => onUpdate(project.id, challengeId, { score: s === score ? null : s })}
              className={`w-8 h-8 flex items-center justify-center text-base rounded-md transition-all active:scale-90 ${
                s <= score ? "text-amber-400" : "text-muted-foreground/20"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-1.5 text-[10px] text-muted-foreground font-medium border-t border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        {expanded ? "Masquer les détails ▴" : "Ajouter des notes ▾"}
      </button>

      {/* Expanded: notes, strength, improvement */}
      {expanded && (
        <div className="px-4 py-3 space-y-2.5 border-t border-border animate-slide-up">
          <textarea
            value={note?.free_notes ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { free_notes: e.target.value })}
            placeholder="Notes libres…"
            rows={2}
            className="w-full px-3 py-2 bg-secondary rounded-xl text-sm leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-semibold text-emerald-400/70 uppercase tracking-wider block mb-0.5">Point fort</label>
              <input
                type="text"
                value={note?.strength ?? ""}
                onChange={(e) => onUpdate(project.id, challengeId, { strength: e.target.value })}
                placeholder="Force…"
                className="w-full h-8 px-2.5 bg-secondary rounded-lg text-xs placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-[9px] font-semibold text-amber-400/70 uppercase tracking-wider block mb-0.5">Amélioration</label>
              <input
                type="text"
                value={note?.improvement ?? ""}
                onChange={(e) => onUpdate(project.id, challengeId, { improvement: e.target.value })}
                placeholder="Axe…"
                className="w-full h-8 px-2.5 bg-secondary rounded-lg text-xs placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
