"use client";

import { useEffect, useRef, useState } from "react";
import { CHALLENGES } from "@/lib/data";
import type { Challenge } from "@/types/database";
import { ChecklistTab } from "./ChecklistTab";
import { CompanyLogo } from "./CompanyLogo";

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
      <h1 className="text-lg font-bold text-[#1A1035] mb-0.5">Planning</h1>
      <p className="text-[11px] text-muted-foreground mb-5">Lundi 13 avril · 8 challenges · 08h45 – 17h00 · Liège</p>

      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#E8E2F4]" />

        <div className="space-y-0.5">
          {CHALLENGES.map((ch, i) => {
            const done = i < timer.completedCount;
            const active = i === timer.currentChallengeIndex && timer.status === "active";
            const expanded = expandedId === ch.id;

            return (
              <div key={ch.id} id={`ch-${ch.id}`}>
                <button onClick={() => { setExpandedId(expanded ? null : ch.id); setDetailTab("info"); }}
                  className="w-full text-left flex gap-3 items-start group">
                  <div className={`relative z-10 mt-3 shrink-0 ${
                    done || active ? "" : ""
                  }`}>
                    <CompanyLogo src={ch.emoji ?? ""} company={ch.company} size={38} />
                    {done && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">✓</span>
                      </div>
                    )}
                    {active && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7A4AED] animate-breathe" />
                    )}
                  </div>

                  <div className={`flex-1 rounded-2xl border p-3.5 my-0.5 transition-all ${
                    active ? "border-[#7A4AED]/30 bg-white shadow-md shadow-[#7A4AED]/5" :
                    done ? "border-emerald-200 bg-emerald-50/50" :
                    expanded ? "border-[#E8E2F4] bg-white shadow-sm" :
                    "border-transparent group-active:bg-white/80"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tabular-nums text-muted-foreground font-semibold">{ch.start_time}</span>
                      <span className="text-sm font-semibold flex-1 truncate text-[#1A1035]">{ch.company}</span>
                      {active && <span className="text-[9px] font-bold text-[#7A4AED] bg-[#F3F0FA] px-1.5 py-0.5 rounded">EN COURS</span>}
                      {done && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FAIT</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{ch.format}</p>
                    {!expanded && ch.transport_to_next && i < CHALLENGES.length - 1 && (
                      <p className="text-[10px] text-gray-300 mt-1 truncate">→ {ch.transport_to_next}</p>
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="ml-[50px] mb-2 animate-slide-up">
                    <div className="flex gap-1 mb-3 bg-[#F3F0FA] rounded-xl p-0.5">
                      {(["info", "check"] as const).map((t) => (
                        <button key={t} onClick={() => setDetailTab(t)}
                          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                            detailTab === t ? "bg-white text-[#1A1035] shadow-sm" : "text-muted-foreground"
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
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFE3E8]" />
        </div>
        <p className="text-xs text-muted-foreground">18h00 · Verre de clôture 🥂</p>
      </div>
    </div>
  );
}

function ChallengeInfo({ ch }: { ch: Challenge }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-[#F3F0FA] p-3">
        <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.challenge_description}</p>
        <p className="text-xs text-[#7A4AED] font-semibold mt-1.5">{ch.format}</p>
      </div>

      {ch.briefing_notes && (
        <div className="rounded-xl bg-[#FFE3E8] p-3">
          <p className="text-[10px] font-bold text-[#F46277] uppercase tracking-widest mb-1">Briefing</p>
          <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.briefing_notes}</p>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Conseils</p>
        <ul className="space-y-1.5">
          {ch.tips.map((t, i) => (
            <li key={i} className="text-[13px] leading-relaxed pl-3.5 relative text-[#1A1035]/80">
              <span className="absolute left-0 text-[#7A4AED] font-bold">›</span>{t}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ch.skills.map((s) => (
          <span key={s} className="text-[10px] bg-[#F3F0FA] text-[#7A4AED] px-2 py-0.5 rounded-md font-medium">{s}</span>
        ))}
      </div>

      <div className="space-y-2.5 text-[13px]">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Lieu</p>
          <p className="font-medium text-[#1A1035]">{ch.location}</p>
          <p className="text-muted-foreground text-xs">{ch.address}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jury</p>
          <p className="text-[#1A1035]/60">{ch.jury.join(" · ")}</p>
        </div>
        {ch.contact_name && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact</p>
              <p className="text-[#1A1035]">{ch.contact_name}</p>
            </div>
            {ch.contact_phone && (
              <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                className="text-xs text-white bg-[#7A4AED] px-3 py-1.5 rounded-lg font-semibold min-h-[44px] flex items-center shadow-sm">
                Appeler
              </a>
            )}
          </div>
        )}
      </div>

      {ch.transport_to_next && (
        <div className="rounded-xl bg-[#F3F0FA] p-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Transport</p>
          <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.transport_to_next}</p>
        </div>
      )}
    </div>
  );
}
