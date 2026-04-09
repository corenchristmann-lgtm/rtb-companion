"use client";

import { PROJECTS, CHALLENGES } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import { useState } from "react";

export function TeamPage() {
  const { notes } = useNotes();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="font-heading text-2xl pt-2 mb-4">\u00c9quipe 1</h1>

      <div className="space-y-3">
        {PROJECTS.map((project) => {
          const projectNotes = notes.filter((n) => n.project_id === project.id);
          const scores = projectNotes.filter((n) => n.score).map((n) => n.score!);
          const avgScore =
            scores.length > 0
              ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
              : "\u2014";
          const notedCount = projectNotes.filter((n) => n.free_notes || n.score).length;
          const expanded = expandedProject === project.id;

          return (
            <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedProject(expanded ? null : project.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold">{project.name}</h2>
                    <p className="text-sm text-muted-foreground">{project.members}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-primary">{avgScore}</p>
                    <p className="text-[10px] text-muted-foreground">{notedCount}/8</p>
                  </div>
                </div>
              </button>

              {expanded && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    R\u00e9cap par challenge
                  </h3>
                  {CHALLENGES.map((ch) => {
                    const note = projectNotes.find((n) => n.challenge_id === ch.id);
                    return (
                      <div
                        key={ch.id}
                        className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0"
                      >
                        <span className="text-sm">{ch.emoji}</span>
                        <span className="text-xs flex-1 truncate">{ch.company}</span>
                        {note?.score ? (
                          <span className="text-xs text-primary font-semibold">
                            {"★".repeat(note.score)}{"☆".repeat(5 - note.score)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">\u2014</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Strengths & Improvements summary */}
                  {projectNotes.some((n) => n.strength) && (
                    <div className="mt-3">
                      <h4 className="text-[10px] font-semibold text-green-400 uppercase tracking-wider mb-1">
                        Points forts
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {projectNotes
                          .filter((n) => n.strength)
                          .map((n) => (
                            <span
                              key={n.challenge_id}
                              className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-lg"
                            >
                              {n.strength}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                  {projectNotes.some((n) => n.improvement) && (
                    <div className="mt-2">
                      <h4 className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider mb-1">
                        Axes d'am\u00e9lioration
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {projectNotes
                          .filter((n) => n.improvement)
                          .map((n) => (
                            <span
                              key={n.challenge_id}
                              className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-lg"
                            >
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
