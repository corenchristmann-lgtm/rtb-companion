"use client";

import { useState } from "react";
import type { Challenge } from "@/types/database";
import { PROJECTS } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { TimerCircle } from "@/components/TimerCircle";
import { ChecklistTab } from "@/components/ChecklistTab";
import { NoteForm } from "@/components/NoteForm";
import { useNotes } from "@/hooks/useSupabase";

interface ChallengeDetailProps {
  challenge: Challenge;
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  onBack: () => void;
}

type Tab = "infos" | "checklist" | "notes";

export function ChallengeDetail({ challenge, timer, onBack }: ChallengeDetailProps) {
  const [tab, setTab] = useState<Tab>("infos");
  const { notes, upsertNote } = useNotes(undefined, challenge.id);
  const isCurrentChallenge = timer.challenge.id === challenge.id;

  const startSec = parseTimeToSec(challenge.start_time);
  const endSec = parseTimeToSec(challenge.end_time);
  const duration = endSec - startSec;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b border-border px-4 pt-3 pb-2">
        <button onClick={onBack} className="text-primary text-sm mb-2 min-h-[44px] flex items-center">
          \u2190 Retour
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={isCurrentChallenge ? timer.status : "upcoming"} />
              <span className="text-xs text-muted-foreground font-mono">#{challenge.position}</span>
            </div>
            <h1 className="font-heading text-xl">
              {challenge.emoji} {challenge.company}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {challenge.start_time}\u2013{challenge.end_time}
            </p>
          </div>
          {isCurrentChallenge && (
            <TimerCircle
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={timer.status === "active" ? duration : timer.remainingSeconds}
              status={timer.status}
            />
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mt-3">
          {(["infos", "checklist", "notes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t === "infos" ? "Infos" : t === "checklist" ? "Checklist" : "Notes"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {tab === "infos" && <InfosTab challenge={challenge} />}
        {tab === "checklist" && <ChecklistTab challengeId={challenge.id} />}
        {tab === "notes" && (
          <div className="space-y-4">
            {PROJECTS.map((p) => {
              const note = notes.find((n) => n.project_id === p.id);
              return (
                <NoteForm
                  key={p.id}
                  project={p}
                  challengeId={challenge.id}
                  note={note ?? null}
                  onUpdate={upsertNote}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InfosTab({ challenge }: { challenge: Challenge }) {
  return (
    <div className="space-y-4">
      {/* Challenge */}
      <Section title="Challenge">
        <p className="text-sm">{challenge.challenge_description}</p>
      </Section>

      {/* Format */}
      <Section title="Format">
        <p className="text-sm text-primary font-medium">{challenge.format}</p>
      </Section>

      {/* Skills */}
      <Section title="Comp\u00e9tences \u00e9valu\u00e9es">
        <div className="flex flex-wrap gap-1.5">
          {challenge.skills.map((s) => (
            <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* Tips */}
      <Section title="Conseils">
        <ul className="space-y-1.5">
          {challenge.tips.map((t, i) => (
            <li key={i} className="text-sm text-foreground/80 flex gap-2">
              <span className="text-primary mt-0.5">\u2022</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Briefing notes */}
      {challenge.briefing_notes && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-yellow-400 mb-1">{"📌"} Notes de briefing</h3>
          <p className="text-sm text-foreground/80">{challenge.briefing_notes}</p>
        </div>
      )}

      {/* Location */}
      <Section title="Lieu">
        <p className="text-sm font-medium">{challenge.location}</p>
        <p className="text-sm text-muted-foreground">{challenge.address}</p>
      </Section>

      {/* Jury */}
      <Section title="Jury">
        <ul className="space-y-0.5">
          {challenge.jury.map((j) => (
            <li key={j} className="text-sm text-foreground/80">{j}</li>
          ))}
        </ul>
      </Section>

      {/* Contact */}
      {challenge.contact_name && (
        <Section title="Contact">
          <p className="text-sm font-medium">{challenge.contact_name}</p>
          {challenge.contact_phone && (
            <a
              href={`tel:${challenge.contact_phone.replace(/\s/g, "")}`}
              className="text-sm text-primary underline"
            >
              {challenge.contact_phone}
            </a>
          )}
        </Section>
      )}

      {/* Transport */}
      {challenge.transport_to_next && (
        <Section title="🚌 Transport vers le prochain">
          <p className="text-sm text-foreground/80">{challenge.transport_to_next}</p>
        </Section>
      )}

      {/* Prize */}
      <div className="text-center py-2">
        <span className="text-xs text-muted-foreground">{"🏆"} Prix : </span>
        <span className="text-sm font-semibold text-primary">{challenge.prize}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function parseTimeToSec(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}
