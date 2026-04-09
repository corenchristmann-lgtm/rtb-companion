"use client";

import { useState } from "react";
import { CHALLENGES, PROJECTS } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import { NoteForm } from "@/components/NoteForm";

type ViewMode = "by-project" | "by-challenge";

export function NotesPage() {
  const [view, setView] = useState<ViewMode>("by-project");
  const { notes, upsertNote } = useNotes();

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between pt-2 mb-4">
        <h1 className="font-heading text-2xl">Notes</h1>
        <div className="flex bg-secondary rounded-xl p-0.5">
          <button
            onClick={() => setView("by-project")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              view === "by-project" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Par projet
          </button>
          <button
            onClick={() => setView("by-challenge")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              view === "by-challenge" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Par challenge
          </button>
        </div>
      </div>

      {view === "by-project" ? (
        <div className="space-y-6">
          {PROJECTS.map((project) => (
            <div key={project.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {project.name.charAt(0)}
                </div>
                <h2 className="text-base font-semibold">{project.name}</h2>
                <span className="text-xs text-muted-foreground">{project.members}</span>
              </div>
              <div className="space-y-2">
                {CHALLENGES.map((ch) => {
                  const note = notes.find(
                    (n) => n.project_id === project.id && n.challenge_id === ch.id
                  );
                  const hasContent = note?.score || note?.free_notes;
                  return (
                    <NoteCompact
                      key={ch.id}
                      challengeLabel={`${ch.emoji} ${ch.company}`}
                      note={note ?? null}
                      hasContent={!!hasContent}
                      projectId={project.id}
                      challengeId={ch.id}
                      onUpdate={upsertNote}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {CHALLENGES.map((ch) => (
            <div key={ch.id}>
              <h2 className="text-base font-semibold mb-3">
                {ch.emoji} {ch.company}
                <span className="text-xs text-muted-foreground font-normal ml-2">
                  {ch.start_time}\u2013{ch.end_time}
                </span>
              </h2>
              <div className="space-y-3">
                {PROJECTS.map((project) => {
                  const note = notes.find(
                    (n) => n.project_id === project.id && n.challenge_id === ch.id
                  );
                  return (
                    <NoteForm
                      key={project.id}
                      project={project}
                      challengeId={ch.id}
                      note={note ?? null}
                      onUpdate={upsertNote}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCompact({
  challengeLabel,
  note,
  hasContent,
  projectId,
  challengeId,
  onUpdate,
}: {
  challengeLabel: string;
  note: import("@/types/database").Note | null;
  hasContent: boolean;
  projectId: number;
  challengeId: number;
  onUpdate: (pid: number, cid: number, u: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const score = note?.score ?? 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left min-h-[44px]"
      >
        <span className="text-sm flex-1">{challengeLabel}</span>
        {score > 0 && (
          <span className="text-xs text-primary font-semibold">
            {"★".repeat(score)}{"☆".repeat(5 - score)}
          </span>
        )}
        {!hasContent && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            vide
          </span>
        )}
        <span className={`text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}>
          ›
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {/* Star rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onUpdate(projectId, challengeId, { score: s === score ? null : s })}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-xl"
              >
                {s <= score ? "\u2B50" : "\u2606"}
              </button>
            ))}
          </div>
          <textarea
            value={note?.free_notes ?? ""}
            onChange={(e) => onUpdate(projectId, challengeId, { free_notes: e.target.value })}
            placeholder="Notes..."
            rows={2}
            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={note?.strength ?? ""}
              onChange={(e) => onUpdate(projectId, challengeId, { strength: e.target.value })}
              placeholder="💪 Point fort"
              className="h-9 px-2 bg-secondary/50 border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
            <input
              type="text"
              value={note?.improvement ?? ""}
              onChange={(e) => onUpdate(projectId, challengeId, { improvement: e.target.value })}
              placeholder="📈 Amélioration"
              className="h-9 px-2 bg-secondary/50 border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
