"use client";

import type { ChallengeStatusType } from "@/types/database";

const config: Record<ChallengeStatusType, { label: string; className: string }> = {
  upcoming: { label: "\u00c0 VENIR", className: "bg-muted text-muted-foreground" },
  in_transit: { label: "EN TRANSIT", className: "bg-yellow-500/20 text-yellow-400" },
  active: { label: "EN COURS", className: "bg-primary/20 text-primary" },
  completed: { label: "TERMIN\u00c9", className: "bg-green-500/20 text-green-400" },
};

export function StatusBadge({ status }: { status: ChallengeStatusType }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${c.className}`}>
      {c.label}
    </span>
  );
}
