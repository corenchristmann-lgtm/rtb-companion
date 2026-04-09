"use client";

import { formatTime } from "@/hooks/useTimer";
import type { ChallengeStatusType } from "@/types/database";

export function TimerCircle({
  remainingSeconds,
  totalSeconds,
  status,
  size = 64,
}: {
  remainingSeconds: number;
  totalSeconds: number;
  status: ChallengeStatusType;
  size?: number;
}) {
  const stroke = 3;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const offset = circ * (1 - progress);
  const urgent = status === "active" && remainingSeconds <= 300;

  const ringColor =
    status === "completed" ? "stroke-emerald-400" :
    urgent ? "stroke-red-400" :
    status === "active" ? "stroke-primary" :
    "stroke-muted-foreground/40";

  const textColor =
    status === "completed" ? "text-emerald-400" :
    urgent ? "text-red-400" :
    status === "active" ? "text-primary" :
    "text-muted-foreground";

  return (
    <div className={`relative shrink-0 ${urgent ? "animate-pulse-soft" : ""}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          strokeWidth={stroke} className="stroke-secondary" />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${ringColor} transition-all duration-1000`} />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${textColor}`}>
        <span className="text-xs font-semibold tabular-nums">
          {status === "completed" ? "✓" : formatTime(remainingSeconds)}
        </span>
      </div>
    </div>
  );
}
