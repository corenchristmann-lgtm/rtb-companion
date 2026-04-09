"use client";

import { CHALLENGES } from "@/lib/data";
import { ChallengeDetail } from "@/components/ChallengeDetail";
import { StatusBadge } from "@/components/StatusBadge";
import type { ChallengeStatusType } from "@/types/database";

interface ChallengesListProps {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function ChallengesList({ timer, selectedId, onSelect }: ChallengesListProps) {
  if (selectedId !== null) {
    const challenge = CHALLENGES.find((c) => c.id === selectedId);
    if (!challenge) return null;
    return <ChallengeDetail challenge={challenge} timer={timer} onBack={() => onSelect(null)} />;
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="font-heading text-2xl mb-4 pt-2">Challenges</h1>
      <div className="space-y-2">
        {CHALLENGES.map((ch, i) => {
          const isActive = i === timer.currentChallengeIndex;
          const isDone = i < timer.completedCount;
          const status: ChallengeStatusType = isDone
            ? "completed"
            : isActive
            ? timer.status
            : "upcoming";

          return (
            <button
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`w-full text-left bg-card border rounded-2xl p-4 transition-all active:scale-[0.98] ${
                isActive
                  ? "border-primary/50 glow-purple"
                  : isDone
                  ? "border-green-500/30 opacity-80"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">
                      #{ch.position}
                    </span>
                    <StatusBadge status={status} />
                  </div>
                  <h3 className="font-semibold text-sm truncate">{ch.company}</h3>
                  <p className="text-xs text-muted-foreground">
                    {ch.start_time}\u2013{ch.end_time} \u2022 {ch.format}
                  </p>
                </div>
                <span className="text-muted-foreground text-lg">\u203A</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
