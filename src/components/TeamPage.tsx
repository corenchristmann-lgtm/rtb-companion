"use client";

import { PROJECTS, CHALLENGES } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import { useState } from "react";

export function TeamPage() {
  const { notes } = useNotes();
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-lg font-bold tracking-tight mb-4">Équipe 1</h1>

      <div className="space-y-3">
        {PROJECTS.map((p) => {
          const pNotes = notes.filter((n) => n.project_id === p.id);
          const scores = pNotes.filter((n) => n.score).map((n) => n.score!);
          const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "–";
          const count = pNotes.filter((n) => n.free_notes || n.score).length;
          const open = openId === p.id;

          return (
            <div key={p.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : p.id)} className="w-full p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.members}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold tabular-nums">{avg}</p>
                    <p className="text-[10px] text-muted-foreground">{count}/8</p>
                  </div>
                </div>
              </button>

              {open && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                  {/* Per-challenge scores */}
                  <div className="space-y-1">
                    {CHALLENGES.map((ch) => {
                      const note = pNotes.find((n) => n.challenge_id === ch.id);
                      return (
                        <div key={ch.id} className="flex items-center gap-2 py-1">
                          <span className="text-sm shrink-0">{ch.emoji}</span>
                          <span className="text-xs flex-1 truncate text-muted-foreground">{ch.company}</span>
                          {note?.score ? (
                            <span className="text-[11px] text-primary tabular-nums">
                              {"★".repeat(note.score)}{"☆".repeat(5 - note.score)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/40">–</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tags */}
                  {pNotes.some((n) => n.strength) && (
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">Points forts</p>
                      <div className="flex flex-wrap gap-1">
                        {pNotes.filter((n) => n.strength).map((n) => (
                          <span key={n.challenge_id} className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                            {n.strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {pNotes.some((n) => n.improvement) && (
                    <div>
                      <p className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider mb-1">Axes d'amélioration</p>
                      <div className="flex flex-wrap gap-1">
                        {pNotes.filter((n) => n.improvement).map((n) => (
                          <span key={n.challenge_id} className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md">
                            {n.improvement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
