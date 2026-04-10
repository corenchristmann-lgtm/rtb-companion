"use client";

import { useState } from "react";
import { useNotes, useAllNotes } from "@/hooks/useSupabase";
import { TEAMS } from "@/lib/teams";
import type { Team, TeamProject } from "@/lib/teams";
import { CompanyLogo } from "./CompanyLogo";

interface Challenge {
  id: number; company: string; emoji: string | null;
}

interface Props {
  challenges: Challenge[];
  projects: TeamProject[];
  team: Team;
  onOpenGallery: () => void;
}

export function ProjectsScreen({ challenges, projects, team, onOpenGallery }: Props) {
  const { notes } = useNotes();
  const allNotes = useAllNotes();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showOtherTeams, setShowOtherTeams] = useState(false);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1A1035] mb-0.5">Projets</h1>
          <p className="text-[11px] text-[#7C6FA0]">{team.name} · {team.accompanist} · {projects.length} projets</p>
        </div>
        <button onClick={onOpenGallery}
          className="h-9 px-3.5 rounded-xl bg-[#F3F0FA] text-[#7A4AED] text-xs font-semibold active:scale-95 transition-transform flex items-center gap-1.5">
          📷 Galerie
        </button>
      </div>

      {projects.map((p) => {
        const pNotes = notes.filter((n) => n.project_id === p.db_id);
        const scores = pNotes.filter((n) => n.score).map((n) => n.score!);
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const avgStr = scores.length > 0 ? avg.toFixed(1) : "–";
        const count = pNotes.filter((n) => n.free_notes || n.score).length;
        const open = openIdx === p.db_id;

        return (
          <div key={p.db_id} className="rounded-2xl border border-[#E8E2F4] bg-white shadow-sm overflow-hidden">
            <button onClick={() => setOpenIdx(open ? null : p.db_id)} className="w-full p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F3F0FA] flex items-center justify-center text-base font-bold text-[#7A4AED] shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1035]">{p.name}</p>
                  <p className="text-[11px] text-[#7C6FA0]">{p.members.join(", ")}</p>
                  {p.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{p.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-extrabold tabular-nums leading-none text-[#1A1035]">{avgStr}</p>
                  <p className="text-[10px] text-[#7C6FA0] mt-1">{count}/8</p>
                  {scores.length > 0 && (
                    <div className="flex gap-px mt-1.5 justify-end">
                      {[1,2,3,4,5].map((s) => (
                        <div key={s} className={`w-1.5 h-3 rounded-sm ${s <= Math.round(avg) ? "bg-[#7A4AED]" : "bg-[#F3F0FA]"}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {open && (
              <div className="px-4 pb-4 pt-2 border-t border-[#E8E2F4] animate-slide-up">
                <div className="space-y-0.5">
                  {challenges.map((ch) => {
                    const note = pNotes.find((n) => n.challenge_id === ch.id);
                    return (
                      <div key={ch.id} className="flex items-center gap-2 py-1.5">
                        <CompanyLogo src={ch.emoji ?? ""} company={ch.company} size={22} />
                        <span className="text-xs flex-1 truncate text-[#7C6FA0]">{ch.company}</span>
                        {note?.score ? (
                          <div className="flex gap-px">
                            {[1,2,3,4,5].map((s) => (
                              <div key={s} className={`w-1.5 h-3 rounded-sm ${s <= note.score! ? "bg-amber-400" : "bg-[#F3F0FA]"}`} />
                            ))}
                          </div>
                        ) : <span className="text-[10px] text-gray-300">–</span>}
                        {note?.strength && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded max-w-[80px] truncate">{note.strength}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {pNotes.some((n) => n.improvement) && (
                  <div className="mt-3">
                    <p className="text-[9px] font-bold text-[#F46277] uppercase tracking-widest mb-1">Améliorations</p>
                    <div className="flex flex-wrap gap-1">
                      {pNotes.filter((n) => n.improvement).map((n) => (
                        <span key={n.challenge_id} className="text-[10px] bg-[#FFE3E8] text-[#F46277] px-1.5 py-0.5 rounded-md">{n.improvement}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* (13) Cross-team scores */}
      <button onClick={() => setShowOtherTeams(!showOtherTeams)}
        className="w-full h-11 rounded-xl bg-[#F3F0FA] text-[#7A4AED] text-xs font-semibold active:scale-95 transition-transform">
        {showOtherTeams ? "Masquer les autres équipes ▴" : "Voir les autres équipes ▾"}
      </button>

      {showOtherTeams && (
        <div className="space-y-2 animate-slide-up">
          {TEAMS.filter(t => t.id !== team.id).map(otherTeam => {
            const teamProjects = otherTeam.projects;
            const teamNotes = allNotes.filter(n => teamProjects.some(p => p.db_id === n.project_id));
            const teamScores = teamNotes.filter(n => n.score).map(n => n.score!);
            const teamAvg = teamScores.length > 0 ? (teamScores.reduce((a, b) => a + b, 0) / teamScores.length).toFixed(1) : "–";
            const scoredCount = new Set(teamNotes.filter(n => n.score).map(n => n.challenge_id)).size;

            return (
              <div key={otherTeam.id} className="rounded-xl border border-[#E8E2F4] bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1035]">{otherTeam.name}</p>
                    <p className="text-[10px] text-[#7C6FA0]">{otherTeam.accompanist} · {otherTeam.projects.length} projets</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums text-[#1A1035]">{teamAvg}</p>
                    <p className="text-[10px] text-[#7C6FA0]">{scoredCount}/8 notés</p>
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-[10px] text-[#7C6FA0]/50 text-center">Mis à jour toutes les 30 secondes</p>
        </div>
      )}

    </div>
  );
}
