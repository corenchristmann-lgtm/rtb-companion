"use client";

import { CHALLENGES, PROJECTS, CONTACTS } from "@/lib/data";
import { useNotes } from "@/hooks/useSupabase";
import { TimerCircle } from "./TimerCircle";
import { StatusBadge } from "./StatusBadge";

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  onOpenChallenge: (id: number) => void;
}

function timeToSec(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}

export function Dashboard({ timer, onOpenChallenge }: Props) {
  const { notes } = useNotes();
  const ch = timer.challenge;
  const dur = timeToSec(ch.end_time) - timeToSec(ch.start_time);

  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Road-to-Business</h1>
          <p className="text-xs text-muted-foreground">Équipe 1 · Corentin</p>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground font-medium">
          {timer.completedCount}/8
        </span>
      </header>

      {/* Current challenge hero */}
      <section
        onClick={() => onOpenChallenge(ch.id)}
        className="rounded-2xl border border-border bg-card p-4 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <TimerCircle
            remainingSeconds={timer.remainingSeconds}
            totalSeconds={timer.status === "active" ? dur : timer.remainingSeconds}
            status={timer.status}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={timer.status} />
            </div>
            <h2 className="text-base font-semibold leading-tight">
              {ch.emoji} {ch.company}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ch.start_time} – {ch.end_time} · {ch.location}
            </p>
            <p className="text-xs text-primary font-medium mt-1.5">{timer.label}</p>
          </div>
        </div>

        {timer.status === "active" && (
          <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${timer.progressPercent}%` }}
            />
          </div>
        )}
      </section>

      {/* Nav controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={timer.goPrev}
          disabled={timer.currentChallengeIndex === 0}
          className="flex-1 h-9 rounded-xl bg-secondary text-xs font-medium disabled:opacity-25 active:scale-95 transition-transform"
        >
          ← Précédent
        </button>
        {timer.isManualOverride && (
          <button
            onClick={timer.resetToAuto}
            className="h-9 px-3 rounded-xl bg-primary/15 text-primary text-xs font-medium active:scale-95 transition-transform"
          >
            Auto
          </button>
        )}
        <button
          onClick={timer.goNext}
          disabled={timer.currentChallengeIndex === CHALLENGES.length - 1}
          className="flex-1 h-9 rounded-xl bg-secondary text-xs font-medium disabled:opacity-25 active:scale-95 transition-transform"
        >
          Suivant →
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {CHALLENGES.map((c, i) => {
          const done = i < timer.completedCount;
          const active = i === timer.currentChallengeIndex;
          return (
            <button
              key={c.id}
              onClick={() => onOpenChallenge(c.id)}
              className={`h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                active ? "bg-primary text-primary-foreground w-12" :
                done ? "bg-emerald-500/20 text-emerald-400 w-7" :
                "bg-secondary text-muted-foreground w-7"
              }`}
            >
              {active ? (c.emoji ?? "") + c.position : done ? "✓" : c.position}
            </button>
          );
        })}
      </div>

      {/* Projects summary */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Projets</h3>
        <div className="space-y-3">
          {PROJECTS.map((p) => {
            const pNotes = notes.filter((n) => n.project_id === p.id);
            const scores = pNotes.filter((n) => n.score).map((n) => n.score!);
            const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "–";
            const count = pNotes.filter((n) => n.free_notes || n.score).length;

            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.members}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{avg}</p>
                  <p className="text-[10px] text-muted-foreground">{count}/8</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transport */}
      {ch.transport_to_next && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Prochain transport</h3>
          <p className="text-sm">{ch.transport_to_next}</p>
        </section>
      )}

      {/* Contacts */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contacts</h3>
        <div className="space-y-2.5">
          {CONTACTS.map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.role}</p>
              </div>
              {c.phone.startsWith("+") ? (
                <a href={`tel:${c.phone.replace(/\s/g, "")}`}
                   className="text-xs text-primary min-h-[44px] flex items-center">
                  {c.phone}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">{c.phone}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <h3 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">Règles</h3>
        <ul className="space-y-1">
          {["Aucun retard toléré", "Présenter toutes les épreuves", "Tenue professionnelle", "Toujours présenter le projet en premier", "Les entreprises sont des partenaires"].map((r, i) => (
            <li key={i} className="text-xs text-foreground/75 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-destructive/60">{r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
