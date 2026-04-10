"use client";

import { useEffect, useRef, useState } from "react";
import { CHALLENGES } from "@/lib/data";
import type { Challenge } from "@/types/database";
import { ChecklistTab } from "./ChecklistTab";

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  focusId: number | null;
  onClearFocus: () => void;
}

export function PlanningScreen({ timer, focusId, onClearFocus }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(focusId);
  const [detailTab, setDetailTab] = useState<"info" | "check">("info");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusId !== null) {
      setExpandedId(focusId);
      onClearFocus();
      // Scroll to focused challenge
      setTimeout(() => {
        const el = document.getElementById(`ch-${focusId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [focusId, onClearFocus]);

  return (
    <div ref={scrollRef} className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold mb-1">Planning</h1>
      <p className="text-xs text-muted-foreground mb-5">8 challenges · 08h45 – 17h00</p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-1">
          {CHALLENGES.map((ch, i) => {
            const done = i < timer.completedCount;
            const active = i === timer.currentChallengeIndex && timer.status === "active";
            const expanded = expandedId === ch.id;

            return (
              <div key={ch.id} id={`ch-${ch.id}`}>
                {/* Timeline node + card */}
                <button
                  onClick={() => {
                    setExpandedId(expanded ? null : ch.id);
                    setDetailTab("info");
                  }}
                  className="w-full text-left flex gap-3 items-start group"
                >
                  {/* Node */}
                  <div className={`relative z-10 mt-3.5 w-[38px] h-[38px] shrink-0 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                    done ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                    active ? "bg-primary/20 border-primary text-primary animate-breathe" :
                    "bg-card border-border text-muted-foreground"
                  }`}>
                    {done ? "✓" : ch.emoji}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-2xl border p-3.5 my-0.5 transition-colors ${
                    active ? "border-primary/30 bg-card" :
                    done ? "border-emerald-500/15 bg-card/50" :
                    expanded ? "border-border bg-card" :
                    "border-transparent bg-transparent group-hover:bg-card/50"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground font-medium">{ch.start_time}</span>
                      <span className="text-sm font-semibold flex-1">{ch.company}</span>
                      {active && <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">EN COURS</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{ch.format}</p>

                    {/* Transport indicator */}
                    {!expanded && ch.transport_to_next && i < CHALLENGES.length - 1 && (
                      <p className="text-[10px] text-muted-foreground/50 mt-1.5 truncate">
                        → {ch.transport_to_next}
                      </p>
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="ml-[50px] mr-0 mb-2 animate-slide-up">
                    {/* Tabs */}
                    <div className="flex gap-1 mb-3 bg-secondary rounded-xl p-0.5">
                      {(["info", "check"] as const).map((t) => (
                        <button key={t} onClick={() => setDetailTab(t)}
                          className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                            detailTab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                          }`}>
                          {t === "info" ? "Infos" : "Checklist"}
                        </button>
                      ))}
                    </div>

                    {detailTab === "info" ? (
                      <ChallengeInfo ch={ch} />
                    ) : (
                      <ChecklistTab challengeId={ch.id} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* End marker */}
      <div className="flex items-center gap-3 mt-2 ml-1">
        <div className="w-[38px] flex justify-center">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
        </div>
        <p className="text-xs text-muted-foreground">18h00 · Verre de clôture au VentureLab</p>
      </div>
    </div>
  );
}

function ChallengeInfo({ ch }: { ch: Challenge }) {
  return (
    <div className="space-y-3">
      {/* Challenge description */}
      <div className="rounded-xl bg-secondary/50 p-3">
        <p className="text-sm leading-relaxed">{ch.challenge_description}</p>
        <p className="text-xs text-primary font-medium mt-1.5">{ch.format}</p>
      </div>

      {/* Briefing */}
      {ch.briefing_notes && (
        <div className="rounded-xl bg-amber-500/8 border border-amber-500/15 p-3">
          <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Briefing</p>
          <p className="text-[13px] leading-relaxed">{ch.briefing_notes}</p>
        </div>
      )}

      {/* Tips */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Conseils</p>
        <ul className="space-y-1">
          {ch.tips.map((t, i) => (
            <li key={i} className="text-[13px] leading-relaxed pl-3 relative">
              <span className="absolute left-0 text-primary/30">›</span>{t}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {ch.skills.map((s) => (
          <span key={s} className="text-[10px] bg-primary/8 text-primary/70 px-2 py-0.5 rounded-md">{s}</span>
        ))}
      </div>

      {/* Location + Jury + Contact */}
      <div className="space-y-2 text-[13px]">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Lieu</p>
          <p>{ch.location}</p>
          <p className="text-muted-foreground text-xs">{ch.address}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Jury</p>
          <p className="text-foreground/70">{ch.jury.join(" · ")}</p>
        </div>
        {ch.contact_name && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
              <p>{ch.contact_name}</p>
            </div>
            {ch.contact_phone && (
              <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                className="text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-lg font-medium min-h-[44px] flex items-center">
                Appeler
              </a>
            )}
          </div>
        )}
      </div>

      {/* Transport */}
      {ch.transport_to_next && (
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Transport</p>
          <p className="text-[13px] leading-relaxed">{ch.transport_to_next}</p>
        </div>
      )}
    </div>
  );
}
