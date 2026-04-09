"use client";

import { CHALLENGES, PROJECTS, RULES, CONTACTS } from "@/lib/data";
import { useNotes, useAllChecklistProgress } from "@/hooks/useSupabase";
import { formatTime } from "@/hooks/useTimer";
import { TimerCircle } from "@/components/TimerCircle";
import { StatusBadge } from "@/components/StatusBadge";

interface DashboardProps {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  onNavigateToChallenge: (id: number) => void;
}

export function Dashboard({ timer, onNavigateToChallenge }: DashboardProps) {
  const { notes } = useNotes();
  const checklistProgress = useAllChecklistProgress();
  const ch = timer.challenge;

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h1 className="font-heading text-2xl text-primary">RTB Companion</h1>
        <p className="text-xs text-muted-foreground mt-0.5">\u00c9quipe 1 \u2014 Corentin Christmann</p>
      </div>

      {/* Hero: Current challenge */}
      <button
        onClick={() => onNavigateToChallenge(ch.id)}
        className="w-full bg-card border border-border rounded-2xl p-5 glow-purple text-left"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={timer.status} />
              <span className="text-xs text-muted-foreground">
                Challenge {ch.position}/8
              </span>
            </div>
            <h2 className="font-heading text-xl">
              {ch.emoji} {ch.company}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {ch.start_time}\u2013{ch.end_time} \u2022 {ch.location}
            </p>
          </div>
          <TimerCircle
            remainingSeconds={timer.remainingSeconds}
            totalSeconds={
              timer.status === "active"
                ? (parseTimeToSec(ch.end_time) - parseTimeToSec(ch.start_time))
                : timer.remainingSeconds
            }
            status={timer.status}
          />
        </div>
        <p className="text-sm font-medium text-primary">{timer.label}</p>
        {timer.status === "active" && (
          <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${timer.progressPercent}%` }}
            />
          </div>
        )}
      </button>

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <button
          onClick={timer.goPrev}
          disabled={timer.currentChallengeIndex === 0}
          className="flex-1 h-10 bg-secondary rounded-xl text-sm font-medium disabled:opacity-30 active:scale-95 transition-transform"
        >
          \u25C0 Pr\u00e9c\u00e9dent
        </button>
        {timer.isManualOverride && (
          <button
            onClick={timer.resetToAuto}
            className="h-10 px-3 bg-primary/20 text-primary rounded-xl text-sm font-medium active:scale-95 transition-transform"
          >
            Auto
          </button>
        )}
        <button
          onClick={timer.goNext}
          disabled={timer.currentChallengeIndex === CHALLENGES.length - 1}
          className="flex-1 h-10 bg-secondary rounded-xl text-sm font-medium disabled:opacity-30 active:scale-95 transition-transform"
        >
          Suivant \u25B6
        </button>
      </div>

      {/* Progress stepper */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-3">Progression</h3>
        <div className="flex gap-1 items-center overflow-x-auto pb-1">
          {CHALLENGES.map((c, i) => {
            const isActive = i === timer.currentChallengeIndex;
            const isDone = i < timer.completedCount;
            return (
              <button
                key={c.id}
                onClick={() => onNavigateToChallenge(c.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all min-w-[44px] ${
                  isActive ? "bg-primary/20 scale-105" : isDone ? "opacity-70" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                    isDone
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : isActive
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {isDone ? "\u2713" : c.position}
                </div>
                <span className="text-[9px] text-muted-foreground leading-tight text-center max-w-[48px] truncate">
                  {c.company.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {timer.completedCount}/8 challenges termin\u00e9s
        </p>
      </div>

      {/* Project summaries */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-3">Projets</h3>
        <div className="space-y-2">
          {PROJECTS.map((p) => {
            const projectNotes = notes.filter((n) => n.project_id === p.id);
            const scores = projectNotes.filter((n) => n.score).map((n) => n.score!);
            const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "\u2014";
            const notedCount = projectNotes.filter((n) => n.free_notes || n.score).length;

            return (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.members}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{avg}</p>
                  <p className="text-[10px] text-muted-foreground">{notedCount}/8 not\u00e9s</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transport next */}
      {ch.transport_to_next && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-semibold mb-1">{"🚌"} Prochain transport</h3>
          <p className="text-sm text-muted-foreground">{ch.transport_to_next}</p>
        </div>
      )}

      {/* Rules */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-2 text-destructive">\u26A0\uFE0F R\u00e8gles importantes</h3>
        <ul className="space-y-1">
          {RULES.map((r, i) => (
            <li key={i} className="text-xs text-foreground/80 flex gap-2">
              <span className="text-destructive">\u2022</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Contacts */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-semibold mb-2">{"📞"} Contacts</h3>
        <div className="space-y-2">
          {CONTACTS.map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              {c.phone.startsWith("+") ? (
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="text-xs text-primary underline min-h-[44px] flex items-center"
                >
                  {c.phone}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">{c.phone}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseTimeToSec(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}
