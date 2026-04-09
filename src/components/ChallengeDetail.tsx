"use client";

import { useState } from "react";
import type { Challenge } from "@/types/database";
import { PROJECTS } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";
import { TimerCircle } from "./TimerCircle";
import { ChecklistTab } from "./ChecklistTab";
import { NoteForm } from "./NoteForm";
import { useNotes } from "@/hooks/useSupabase";

type DetailTab = "info" | "check" | "notes";

function timeToSec(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}

export function ChallengeDetail({
  challenge: ch,
  timer,
  onBack,
}: {
  challenge: Challenge;
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<DetailTab>("info");
  const { notes, upsertNote } = useNotes(undefined, ch.id);
  const isCurrent = timer.challenge.id === ch.id;
  const dur = timeToSec(ch.end_time) - timeToSec(ch.start_time);

  return (
    <div className="max-w-lg mx-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border px-4 pt-4 pb-3">
        <button onClick={onBack} className="text-xs text-primary font-medium mb-2 min-h-[44px] flex items-center">
          ← Retour
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <StatusBadge status={isCurrent ? timer.status : "upcoming"} />
              <span className="text-[11px] text-muted-foreground tabular-nums">#{ch.position}/8</span>
            </div>
            <h1 className="text-lg font-bold leading-tight">{ch.emoji} {ch.company}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{ch.start_time} – {ch.end_time}</p>
          </div>
          {isCurrent && (
            <TimerCircle
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={timer.status === "active" ? dur : timer.remainingSeconds}
              status={timer.status}
              size={56}
            />
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 bg-secondary rounded-xl p-0.5">
          {([
            { id: "info" as DetailTab, label: "Infos" },
            { id: "check" as DetailTab, label: "Checklist" },
            { id: "notes" as DetailTab, label: "Notes" },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                tab === t.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {tab === "info" && <InfoTab ch={ch} />}
        {tab === "check" && <ChecklistTab challengeId={ch.id} />}
        {tab === "notes" && (
          <div className="space-y-3">
            {PROJECTS.map((p) => (
              <NoteForm
                key={p.id}
                project={p}
                challengeId={ch.id}
                note={notes.find((n) => n.project_id === p.id) ?? null}
                onUpdate={upsertNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTab({ ch }: { ch: Challenge }) {
  return (
    <>
      {/* Challenge */}
      <Card title="Challenge">
        <p className="text-sm leading-relaxed">{ch.challenge_description}</p>
        <p className="text-xs text-primary font-medium mt-2">{ch.format}</p>
      </Card>

      {/* Skills */}
      <Card title="Compétences évaluées">
        <div className="flex flex-wrap gap-1.5">
          {ch.skills.map((s) => (
            <span key={s} className="text-[11px] bg-primary/10 text-primary/90 px-2 py-0.5 rounded-md">{s}</span>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card title="Conseils">
        <ul className="space-y-1.5">
          {ch.tips.map((t, i) => (
            <li key={i} className="text-sm leading-relaxed pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-primary/50 before:font-bold">{t}</li>
          ))}
        </ul>
      </Card>

      {/* Briefing */}
      {ch.briefing_notes && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">Notes de briefing</h3>
          <p className="text-sm leading-relaxed">{ch.briefing_notes}</p>
        </div>
      )}

      {/* Lieu */}
      <Card title="Lieu">
        <p className="text-sm font-medium">{ch.location}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{ch.address}</p>
      </Card>

      {/* Jury */}
      <Card title="Jury">
        <div className="space-y-0.5">
          {ch.jury.map((j) => (
            <p key={j} className="text-sm">{j}</p>
          ))}
        </div>
      </Card>

      {/* Contact */}
      {ch.contact_name && (
        <Card title="Contact">
          <p className="text-sm font-medium">{ch.contact_name}</p>
          {ch.contact_phone && (
            <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`} className="text-sm text-primary">
              {ch.contact_phone}
            </a>
          )}
        </Card>
      )}

      {/* Transport */}
      {ch.transport_to_next && (
        <Card title="Transport suivant">
          <p className="text-sm">{ch.transport_to_next}</p>
        </Card>
      )}
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}
