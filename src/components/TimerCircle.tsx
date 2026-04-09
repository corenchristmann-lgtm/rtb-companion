"use client";

import { formatTime } from "@/hooks/useTimer";
import type { ChallengeStatusType } from "@/types/database";

interface TimerCircleProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: ChallengeStatusType;
}

export function TimerCircle({ remainingSeconds, totalSeconds, status }: TimerCircleProps) {
  const size = 72;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const offset = circumference * (1 - progress);

  const isUrgent = status === "active" && remainingSeconds <= 300;
  const colorClass =
    status === "completed"
      ? "text-green-400"
      : status === "active"
      ? isUrgent
        ? "text-red-400"
        : "text-primary"
      : "text-muted-foreground";

  const strokeColor =
    status === "completed"
      ? "stroke-green-400"
      : status === "active"
      ? isUrgent
        ? "stroke-red-400"
        : "stroke-primary"
      : "stroke-muted-foreground";

  return (
    <div className={`relative flex-shrink-0 ${isUrgent ? "timer-urgent" : ""}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${strokeColor} transition-all duration-1000`}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${colorClass}`}>
        <span className="text-sm font-bold leading-none">
          {status === "completed" ? "\u2713" : formatTime(remainingSeconds)}
        </span>
        {status !== "completed" && (
          <span className="text-[8px] mt-0.5 text-muted-foreground">
            {status === "active" ? "restant" : "avant"}
          </span>
        )}
      </div>
    </div>
  );
}
