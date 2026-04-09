"use client";

import { CHALLENGES } from "@/lib/data";
import { ChallengeDetail } from "./ChallengeDetail";
import { StatusBadge } from "./StatusBadge";
import type { ChallengeStatusType } from "@/types/database";

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function ChallengesList({ timer, selectedId, onSelect }: Props) {
  if (selectedId !== null) {
    const challenge = CHALLENGES.find((c) => c.id === selectedId);
    if (!challenge) return null;
    return <ChallengeDetail challenge={challenge} timer={timer} onBack={() => onSelect(null)} />;
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-lg font-bold tracking-tight mb-4">Challenges</h1>
      <div className="space-y-2">
        {CHALLENGES.map((ch, i) => {
          const done = i < timer.completedCount;
          const active = i === timer.currentChallengeIndex;
          const status: ChallengeStatusType = done ? "completed" : active ? timer.status : "upcoming";

          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`w-full text-left rounded-2xl border bg-card p-3.5 active:scale-[0.98] transition-all ${
                active ? "border-primary/40" : done ? "border-emerald-500/20 opacity-75" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] text-muted-foreground tabular-nums">#{ch.position}</span>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-sm font-semibold truncate">{ch.company}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {ch.start_time} – {ch.end_time}
                  </p>
                </div>
                <span className="text-muted-foreground/40">›</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
