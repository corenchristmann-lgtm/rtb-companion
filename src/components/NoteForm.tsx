"use client";

import type { Note, Project } from "@/types/database";

interface Props {
  project: Project;
  challengeId: number;
  note: Note | null;
  onUpdate: (pid: number, cid: number, u: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>) => void;
}

export function NoteForm({ project, challengeId, note, onUpdate }: Props) {
  const score = note?.score ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
          {project.name[0]}
        </div>
        <p className="text-sm font-semibold flex-1">{project.name}</p>
        {!note?.score && !note?.free_notes && (
          <span className="text-[10px] text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded">
            Non noté
          </span>
        )}
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(project.id, challengeId, { score: s === score ? null : s })}
            className="w-10 h-10 flex items-center justify-center text-lg active:scale-90 transition-transform"
            aria-label={`${s} étoile${s > 1 ? "s" : ""}`}
          >
            {s <= score ? "★" : "☆"}
          </button>
        ))}
      </div>

      {/* Notes */}
      <textarea
        value={note?.free_notes ?? ""}
        onChange={(e) => onUpdate(project.id, challengeId, { free_notes: e.target.value })}
        placeholder="Notes libres…"
        rows={2}
        className="w-full px-3 py-2 bg-secondary rounded-xl text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
      />

      {/* Strength / Improvement */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-emerald-400/80 uppercase tracking-wider block mb-1">Point fort</label>
          <input
            type="text"
            value={note?.strength ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { strength: e.target.value })}
            placeholder="Force…"
            className="w-full h-8 px-2.5 bg-secondary rounded-lg text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-amber-400/80 uppercase tracking-wider block mb-1">Amélioration</label>
          <input
            type="text"
            value={note?.improvement ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { improvement: e.target.value })}
            placeholder="Axe…"
            className="w-full h-8 px-2.5 bg-secondary rounded-lg text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
          />
        </div>
      </div>
    </div>
  );
}
