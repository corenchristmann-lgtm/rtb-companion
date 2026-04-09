"use client";

import { useState } from "react";
import { CHALLENGES, PROJECTS } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import { NoteForm } from "./NoteForm";

type View = "project" | "challenge";

export function NotesPage() {
  const [view, setView] = useState<View>("challenge");
  const { notes, upsertNote } = useNotes();

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      {/* Header + toggle */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold tracking-tight">Notes</h1>
        <div className="flex bg-secondary rounded-xl p-0.5">
          <button
            onClick={() => setView("challenge")}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
              view === "challenge" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Par défi
          </button>
          <button
            onClick={() => setView("project")}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
              view === "project" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Par projet
          </button>
        </div>
      </div>

      {view === "challenge" ? (
        <div className="space-y-6">
          {CHALLENGES.map((ch) => (
            <section key={ch.id}>
              <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span>{ch.emoji}</span>
                <span>{ch.company}</span>
                <span className="text-[11px] text-muted-foreground font-normal">{ch.start_time}</span>
              </h2>
              <div className="space-y-2">
                {PROJECTS.map((p) => (
                  <NoteForm
                    key={p.id}
                    project={p}
                    challengeId={ch.id}
                    note={notes.find((n) => n.project_id === p.id && n.challenge_id === ch.id) ?? null}
                    onUpdate={upsertNote}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {PROJECTS.map((p) => (
            <section key={p.id}>
              <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{p.name[0]}</div>
                <span>{p.name}</span>
              </h2>
              <div className="space-y-2">
                {CHALLENGES.map((ch) => {
                  const note = notes.find((n) => n.project_id === p.id && n.challenge_id === ch.id);
                  return (
                    <CompactNote
                      key={ch.id}
                      label={`${ch.emoji} ${ch.company}`}
                      note={note ?? null}
                      projectId={p.id}
                      challengeId={ch.id}
                      onUpdate={upsertNote}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function CompactNote({
  label, note, projectId, challengeId, onUpdate,
}: {
  label: string;
  note: import("@/types/database").Note | null;
  projectId: number;
  challengeId: number;
  onUpdate: (pid: number, cid: number, u: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const score = note?.score ?? 0;
  const hasContent = !!(note?.score || note?.free_notes);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left min-h-[44px]"
      >
        <span className="text-sm flex-1">{label}</span>
        {score > 0 && (
          <span className="text-[11px] text-primary tabular-nums">
            {"★".repeat(score)}{"☆".repeat(5 - score)}
          </span>
        )}
        {!hasContent && (
          <span className="text-[9px] text-muted-foreground/50 bg-secondary px-1.5 py-0.5 rounded">vide</span>
        )}
        <span className={`text-muted-foreground/30 text-xs transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => onUpdate(projectId, challengeId, { score: s === score ? null : s })}
                className="w-8 h-8 flex items-center justify-center text-base active:scale-90 transition-transform">
                {s <= score ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={note?.free_notes ?? ""}
            onChange={(e) => onUpdate(projectId, challengeId, { free_notes: e.target.value })}
            placeholder="Notes…"
            rows={2}
            className="w-full px-2.5 py-1.5 bg-secondary rounded-lg text-xs leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={note?.strength ?? ""}
              onChange={(e) => onUpdate(projectId, challengeId, { strength: e.target.value })}
              placeholder="Point fort"
              className="h-7 px-2 bg-secondary rounded-md text-[11px] placeholder:text-muted-foreground/40 focus:outline-none" />
            <input type="text" value={note?.improvement ?? ""}
              onChange={(e) => onUpdate(projectId, challengeId, { improvement: e.target.value })}
              placeholder="Amélioration"
              className="h-7 px-2 bg-secondary rounded-md text-[11px] placeholder:text-muted-foreground/40 focus:outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}
