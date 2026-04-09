"use client";

import type { Note, Project } from "@/types/database";

interface NoteFormProps {
  project: Project;
  challengeId: number;
  note: Note | null;
  onUpdate: (
    projectId: number,
    challengeId: number,
    updates: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>
  ) => void;
}

export function NoteForm({ project, challengeId, note, onUpdate }: NoteFormProps) {
  const score = note?.score ?? 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {project.name.charAt(0)}
        </div>
        <h3 className="text-sm font-semibold">{project.name}</h3>
        {!note?.score && !note?.free_notes && (
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Non not\u00e9
          </span>
        )}
      </div>

      {/* Star rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(project.id, challengeId, { score: s === score ? null : s })}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl transition-transform active:scale-90"
          >
            {s <= score ? "\u2B50" : "\u2606"}
          </button>
        ))}
      </div>

      {/* Free notes */}
      <textarea
        value={note?.free_notes ?? ""}
        onChange={(e) => onUpdate(project.id, challengeId, { free_notes: e.target.value })}
        placeholder="Notes libres..."
        rows={2}
        className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-2"
      />

      {/* Strength + Improvement */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-green-400 uppercase tracking-wider mb-0.5 block">
            {"💪"} Point fort
          </label>
          <input
            type="text"
            value={note?.strength ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { strength: e.target.value })}
            placeholder="Force..."
            className="w-full h-9 px-2 bg-secondary/50 border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-yellow-400 uppercase tracking-wider mb-0.5 block">
            {"📈"} Amélioration
          </label>
          <input
            type="text"
            value={note?.improvement ?? ""}
            onChange={(e) => onUpdate(project.id, challengeId, { improvement: e.target.value })}
            placeholder="Axe..."
            className="w-full h-9 px-2 bg-secondary/50 border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
      </div>
    </div>
  );
}
