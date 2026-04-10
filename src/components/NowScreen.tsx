"use client";

import { useState } from "react";
import { CHALLENGES, CONTACTS } from "@/lib/data";
import { formatTime } from "@/hooks/useTimer";
import { ChecklistTab } from "./ChecklistTab";

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  onOpenChallenge: (id: number) => void;
}

export function NowScreen({ timer, onOpenChallenge }: Props) {
  const ch = timer.challenge;
  const [showTips, setShowTips] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const isActive = timer.status === "active";
  const isTransit = timer.status === "in_transit";
  const isDone = timer.status === "completed";
  const urgent = isActive && timer.remainingSeconds <= 300;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">

      {/* ── Status + Position ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isActive ? (urgent ? "bg-red-400 animate-breathe" : "bg-primary animate-breathe") :
            isTransit ? "bg-amber-400" :
            isDone ? "bg-emerald-400" : "bg-muted-foreground/30"
          }`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isActive ? (urgent ? "text-red-400" : "text-primary") :
            isTransit ? "text-amber-400" :
            isDone ? "text-emerald-400" : "text-muted-foreground"
          }`}>
            {isActive ? (urgent ? "Fin imminente" : "En cours") :
             isTransit ? "En transit" :
             isDone ? "Terminé" : "À venir"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{timer.completedCount}/8</span>
      </div>

      {/* ── Giant Timer ── */}
      <div className="text-center py-2">
        <p className={`text-6xl font-bold timer-display leading-none ${
          urgent ? "text-red-400" :
          isActive ? "text-foreground" :
          "text-muted-foreground"
        }`}>
          {isDone ? "✓" : formatTime(timer.remainingSeconds)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">{timer.label}</p>
        {isActive && (
          <div className="mt-3 mx-auto max-w-[200px] h-1 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${urgent ? "bg-red-400" : "bg-primary"}`}
              style={{ width: `${timer.progressPercent}%` }} />
          </div>
        )}
      </div>

      {/* ── Challenge Card ── */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl leading-none mt-0.5">{ch.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold leading-tight">{ch.company}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ch.start_time} – {ch.end_time}</p>
            <p className="text-xs text-muted-foreground">{ch.location}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">{ch.challenge_description}</p>
        <p className="text-xs text-primary font-medium mt-2">{ch.format}</p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => { setShowTips(!showTips); setShowChecklist(false); }}
          className={`rounded-xl py-3 text-center transition-colors ${
            showTips ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          }`}
        >
          <span className="text-lg block">💡</span>
          <span className="text-[10px] font-medium mt-0.5 block">Tips</span>
        </button>
        <button
          onClick={() => { setShowChecklist(!showChecklist); setShowTips(false); }}
          className={`rounded-xl py-3 text-center transition-colors ${
            showChecklist ? "bg-primary text-primary-foreground" : "bg-card border border-border"
          }`}
        >
          <span className="text-lg block">✅</span>
          <span className="text-[10px] font-medium mt-0.5 block">Checklist</span>
        </button>
        {ch.contact_phone && (
          <a
            href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
            className="rounded-xl py-3 text-center bg-card border border-border"
          >
            <span className="text-lg block">📞</span>
            <span className="text-[10px] font-medium mt-0.5 block">Appeler</span>
          </a>
        )}
      </div>

      {/* ── Tips Panel ── */}
      {showTips && (
        <div className="rounded-2xl border border-border bg-card p-4 animate-slide-up space-y-3">
          {/* Briefing first — most important */}
          {ch.briefing_notes && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Briefing</p>
              <p className="text-sm leading-relaxed">{ch.briefing_notes}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Conseils</p>
            <ul className="space-y-1.5">
              {ch.tips.map((t, i) => (
                <li key={i} className="text-sm leading-relaxed pl-4 relative">
                  <span className="absolute left-0 text-primary/40">›</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Compétences évaluées</p>
            <div className="flex flex-wrap gap-1.5">
              {ch.skills.map((s) => (
                <span key={s} className="text-[11px] bg-primary/10 text-primary/80 px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>
          {/* Jury */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Jury</p>
            <p className="text-sm text-foreground/70">{ch.jury.join(" · ")}</p>
          </div>
        </div>
      )}

      {/* ── Checklist Panel ── */}
      {showChecklist && (
        <div className="animate-slide-up">
          <ChecklistTab challengeId={ch.id} />
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex gap-2">
        <button
          onClick={timer.goPrev}
          disabled={timer.currentChallengeIndex === 0}
          className="flex-1 h-10 rounded-xl bg-card border border-border text-xs font-medium disabled:opacity-20 active:scale-95 transition-transform"
        >
          ← Précédent
        </button>
        {timer.isManualOverride && (
          <button onClick={timer.resetToAuto}
            className="h-10 px-4 rounded-xl bg-primary/15 text-primary text-xs font-medium">
            Auto
          </button>
        )}
        <button
          onClick={timer.goNext}
          disabled={timer.currentChallengeIndex === CHALLENGES.length - 1}
          className="flex-1 h-10 rounded-xl bg-card border border-border text-xs font-medium disabled:opacity-20 active:scale-95 transition-transform"
        >
          Suivant →
        </button>
      </div>

      {/* ── Transport ── */}
      {ch.transport_to_next && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Prochain transport</p>
          <p className="text-sm leading-relaxed">{ch.transport_to_next}</p>
        </div>
      )}

      {/* ── Emergency contacts ── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CONTACTS.map((c) => (
          <a
            key={c.name}
            href={c.phone.startsWith("+") ? `tel:${c.phone.replace(/\s/g, "")}` : undefined}
            className="shrink-0 rounded-xl border border-border bg-card px-3 py-2 min-w-[120px]"
          >
            <p className="text-xs font-medium truncate">{c.name}</p>
            <p className="text-[10px] text-muted-foreground">{c.role}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
