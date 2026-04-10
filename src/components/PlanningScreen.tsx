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
      setTimeout(() => {
        document.getElementById(`ch-${focusId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [focusId, onClearFocus]);

  return (
    <div ref={scrollRef} className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold mb-0.5">Planning</h1>
      <p className="text-[11px] text-muted-foreground mb-5">8 challenges · 08h45 – 17h00 · Liège</p>

      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#2E2B45]" />

        <div className="space-y-0.5">
          {CHALLENGES.map((ch, i) => {
            const done = i < timer.completedCount;
            const active = i === timer.currentChallengeIndex && timer.status === "active";
            const expanded = expandedId === ch.id;

            return (
              <div key={ch.id} id={`ch-${ch.id}`}>
                <button onClick={() => { setExpandedId(expanded ? null : ch.id); setDetailTab("info"); }}
                  className="w-full text-left flex gap-3 items-start group">
                  {/* Node */}
                  <div className={`relative z-10 mt-3 w-[38px] h-[38px] shrink-0 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    done ? "bg-[#34D399]/15 border-[#34D399]/40 text-[#34D399]" :
                    active ? "bg-[#7A4AED]/15 border-[#7A4AED] text-[#7A4AED] animate-breathe" :
                    "bg-[#1A1927] border-[#2E2B45] text-muted-foreground"
                  }`}>
                    {done ? "✓" : ch.emoji}
                  </div>

                  {/* Row */}
                  <div className={`flex-1 rounded-2xl border p-3.5 my-0.5 transition-all ${
                    active ? "border-[#7A4AED]/30 bg-[#1A1927] vl-glow" :
                    done ? "border-[#34D399]/10 bg-[#1A1927]/40" :
                    expanded ? "border-[#2E2B45] bg-[#1A1927]" :
                    "border-transparent group-active:bg-[#1A1927]/50"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tabular-nums text-muted-foreground font-semibold">{ch.start_time}</span>
                      <span className="text-sm font-semibold flex-1 truncate">{ch.company}</span>
                      {active && <span className="text-[9px] font-bold text-[#7A4AED] bg-[#7A4AED]/10 px-1.5 py-0.5 rounded">EN COURS</span>}
                      {done && <span className="text-[9px] font-bold text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">FAIT</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{ch.format}</p>
                    {!expanded && ch.transport_to_next && i < CHALLENGES.length - 1 && (
                      <p className="text-[10px] text-muted-foreground/30 mt-1 truncate">→ {ch.transport_to_next}</p>
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="ml-[50px] mb-2 animate-slide-up">
                    <div className="flex gap-1 mb-3 bg-[#232136] rounded-xl p-0.5">
                      {(["info", "check"] as const).map((t) => (
                        <button key={t} onClick={() => setDetailTab(t)}
                          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                            detailTab === t ? "bg-[#0F0E17] text-foreground" : "text-muted-foreground"
                          }`}>
                          {t === "info" ? "Infos" : "Checklist"}
                        </button>
                      ))}
                    </div>
                    {detailTab === "info" ? <ChallengeInfo ch={ch} /> : <ChecklistTab challengeId={ch.id} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 ml-1">
        <div className="w-[38px] flex justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F46277]/30" />
        </div>
        <p className="text-xs text-muted-foreground">18h00 · Verre de clôture 🥂</p>
      </div>
    </div>
  );
}

function ChallengeInfo({ ch }: { ch: Challenge }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-[#232136] p-3">
        <p className="text-[13px] leading-relaxed">{ch.challenge_description}</p>
        <p className="text-xs text-[#7A4AED] font-semibold mt-1.5">{ch.format}</p>
      </div>

      {ch.briefing_notes && (
        <div className="rounded-xl bg-[#F46277]/6 border border-[#F46277]/12 p-3">
          <p className="text-[10px] font-bold text-[#F46277] uppercase tracking-widest mb-1">Briefing</p>
          <p className="text-[13px] leading-relaxed">{ch.briefing_notes}</p>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Conseils</p>
        <ul className="space-y-1.5">
          {ch.tips.map((t, i) => (
            <li key={i} className="text-[13px] leading-relaxed pl-3.5 relative">
              <span className="absolute left-0 text-[#7A4AED]/40 font-bold">›</span>{t}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ch.skills.map((s) => (
          <span key={s} className="text-[10px] bg-[#7A4AED]/8 text-[#9B73F2] px-2 py-0.5 rounded-md font-medium">{s}</span>
        ))}
      </div>

      <div className="space-y-2.5 text-[13px]">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lieu</p>
          <p className="font-medium">{ch.location}</p>
          <p className="text-muted-foreground text-xs">{ch.address}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jury</p>
          <p className="text-foreground/60">{ch.jury.join(" · ")}</p>
        </div>
        {ch.contact_name && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact</p>
              <p>{ch.contact_name}</p>
            </div>
            {ch.contact_phone && (
              <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                className="text-xs text-[#7A4AED] bg-[#7A4AED]/10 px-3 py-1.5 rounded-lg font-semibold min-h-[44px] flex items-center">
                Appeler
              </a>
            )}
          </div>
        )}
      </div>

      {ch.transport_to_next && (
        <div className="rounded-xl bg-[#232136] p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Transport</p>
          <p className="text-[13px] leading-relaxed">{ch.transport_to_next}</p>
        </div>
      )}
    </div>
  );
}
