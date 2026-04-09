"use client";

import type { ChallengeStatusType } from "@/types/database";

const styles: Record<ChallengeStatusType, { label: string; cls: string }> = {
  upcoming:   { label: "À venir",    cls: "bg-muted text-muted-foreground" },
  in_transit: { label: "En transit", cls: "bg-amber-500/15 text-amber-400" },
  active:     { label: "En cours",   cls: "bg-primary/15 text-primary" },
  completed:  { label: "Terminé",    cls: "bg-emerald-500/15 text-emerald-400" },
};

export function StatusBadge({ status }: { status: ChallengeStatusType }) {
  const s = styles[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  );
}
