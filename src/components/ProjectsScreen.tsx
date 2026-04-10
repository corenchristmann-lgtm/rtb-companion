"use client";

import { useState } from "react";
import { PROJECTS, CHALLENGES } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";

export function ProjectsScreen() {
  const { notes } = useNotes();
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-3">
      <h1 className="text-lg font-bold mb-0.5">Projets</h1>
      <p className="text-[11px] text-muted-foreground mb-4">Équipe 1 · 4 projets incubés</p>

      {PROJECTS.map((p) => {
        const pNotes = notes.filter((n) => n.project_id === p.id);
        const scores = pNotes.filter((n) => n.score).map((n) => n.score!);
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const avgStr = scores.length > 0 ? avg.toFixed(1) : "–";
        const count = pNotes.filter((n) => n.free_notes || n.score).length;
        const open = openId === p.id;

        return (
          <div key={p.id} className="rounded-2xl border border-[#2E2B45] bg-[#1A1927] overflow-hidden">
            <button onClick={() => setOpenId(open ? null : p.id)} className="w-full p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#7A4AED]/10 flex items-center justify-center text-base font-bold text-[#7A4AED] shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.members}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-extrabold tabular-nums leading-none">{avgStr}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{count}/8</p>
                  {scores.length > 0 && (
                    <div className="flex gap-px mt-1.5 justify-end">
                      {[1,2,3,4,5].map((s) => (
                        <div key={s} className={`w-1.5 h-3 rounded-sm ${s <= Math.round(avg) ? "bg-[#7A4AED]" : "bg-[#232136]"}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {open && (
              <div className="px-4 pb-4 pt-2 border-t border-[#2E2B45] animate-slide-up">
                <div className="space-y-0.5">
                  {CHALLENGES.map((ch) => {
                    const note = pNotes.find((n) => n.challenge_id === ch.id);
                    return (
                      <div key={ch.id} className="flex items-center gap-2 py-1.5">
                        <span className="text-xs shrink-0">{ch.emoji}</span>
                        <span className="text-xs flex-1 truncate text-muted-foreground">{ch.company}</span>
                        {note?.score ? (
                          <div className="flex gap-px">
                            {[1,2,3,4,5].map((s) => (
                              <div key={s} className={`w-1.5 h-3 rounded-sm ${s <= note.score! ? "bg-[#FBBF24]" : "bg-[#232136]"}`} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/20">–</span>
                        )}
                        {note?.strength && (
                          <span className="text-[10px] bg-[#34D399]/10 text-[#34D399]/70 px-1.5 py-0.5 rounded max-w-[80px] truncate">{note.strength}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {pNotes.some((n) => n.strength) && (
                  <div className="mt-3">
                    <p className="text-[9px] font-bold text-[#34D399]/50 uppercase tracking-widest mb-1">Points forts</p>
                    <div className="flex flex-wrap gap-1">
                      {pNotes.filter((n) => n.strength).map((n) => (
                        <span key={n.challenge_id} className="text-[10px] bg-[#34D399]/8 text-[#34D399]/60 px-1.5 py-0.5 rounded-md">{n.strength}</span>
                      ))}
                    </div>
                  </div>
                )}
                {pNotes.some((n) => n.improvement) && (
                  <div className="mt-2">
                    <p className="text-[9px] font-bold text-[#F46277]/50 uppercase tracking-widest mb-1">Améliorations</p>
                    <div className="flex flex-wrap gap-1">
                      {pNotes.filter((n) => n.improvement).map((n) => (
                        <span key={n.challenge_id} className="text-[10px] bg-[#F46277]/8 text-[#F46277]/60 px-1.5 py-0.5 rounded-md">{n.improvement}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Rules */}
      <div className="rounded-2xl border border-[#F46277]/15 bg-[#F46277]/5 p-4 mt-2">
        <p className="text-[10px] font-bold text-[#F46277]/60 uppercase tracking-widest mb-2">Rappels</p>
        <ul className="space-y-1">
          {["Aucun retard toléré", "Présenter toutes les épreuves", "Tenue professionnelle", "Toujours présenter le projet en premier"].map((r, i) => (
            <li key={i} className="text-xs text-foreground/50 pl-3 relative">
              <span className="absolute left-0 text-[#F46277]/30">–</span>{r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
