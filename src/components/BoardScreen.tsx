"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CONTACTS } from "@/lib/teams";
import type { Team } from "@/lib/teams";
import { formatTime } from "@/hooks/useTimer";
import { usePhotos } from "@/hooks/useSupabase";
import { CompanyLogo } from "./CompanyLogo";
import { ChecklistTab } from "./ChecklistTab";

interface Challenge {
  id: number; position: number; company: string; emoji: string | null;
  start_time: string; end_time: string; location: string; address: string;
  challenge_description: string; format: string; skills: string[]; tips: string[];
  briefing_notes: string | null; jury: string[]; contact_name: string | null;
  contact_phone: string | null; prize: string; transport_to_next: string | null;
  directions_url: string | null;
}

interface Props {
  timer: ReturnType<typeof import("@/hooks/useTimer").useTimer>;
  challenges: Challenge[];
  team: Team;
  onLogout: () => void;
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function BoardScreen({ timer, challenges, team, onLogout }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { uploading, uploadPhoto } = usePhotos();
  const fileRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const isEventDay = timer.isEventDay || timer.isManualOverride;

  useEffect(() => {
    if (isEventDay && timer.status === "active" && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isEventDay, timer.status, timer.currentChallengeIndex]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file, team.name);
    e.target.value = "";
  };

  return (
    <div className="px-4 pt-5 pb-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="relative">
        <button onClick={() => { if (confirm("Changer d'equipe ? Tu perdras ta selection actuelle.")) onLogout(); }} className="absolute right-0 top-0 text-[11px] text-[#5A4D80]/70 transition-colors duration-200 pressable">
          Changer d'equipe
        </button>
        <div className="flex justify-center">
          <Image src="/logos/venturelab.svg" alt="VentureLab" width={120} height={40} unoptimized />
        </div>
        <div className="text-center mt-1.5">
          <p className="text-xs font-medium text-[#7C6FA0]">{team.name} · {team.accompanist}</p>
        </div>
      </div>

      {/* Countdown / Status */}
      {!isEventDay ? (
        <div className="rounded-2xl bg-gradient-to-br from-[#7A4AED] to-[#9B73F2] p-5 text-center text-white shadow-lg shadow-[#7A4AED]/20">
          <p className="text-5xl font-extrabold timer-display">
            {timer.daysUntilEvent > 0 ? `J-${timer.daysUntilEvent}` : "RTB termine"}
          </p>
          <p className="text-sm opacity-80 mt-2">{timer.label}</p>
          <p className="text-xs opacity-60 mt-0.5">Lundi 13 avril 2026 · Liege</p>
        </div>
      ) : (() => {
        const ch = challenges[timer.currentChallengeIndex];
        const nextCh = challenges[timer.currentChallengeIndex + 1];
        const allDone = timer.status === "completed" && timer.currentChallengeIndex === challenges.length - 1;
        const urgent = timer.status === "active" && timer.remainingSeconds <= 300;

        return (
          <div className={`rounded-2xl p-5 text-center shadow-sm ${
            urgent ? "bg-gradient-to-br from-[#F46277] to-[#E8384F] text-white shadow-[#F46277]/20" :
            timer.status === "active" ? "bg-gradient-to-br from-[#7A4AED] to-[#9B73F2] text-white shadow-[#7A4AED]/20" :
            timer.status === "in_transit" ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-400/20" :
            allDone ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-400/20" :
            "bg-[#F3F0FA]"
          }`}>
            {ch && !allDone && (
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">
                {timer.status === "active" ? ch.company : timer.status === "in_transit" ? `Prochain : ${ch.company}` : ch.company}
              </p>
            )}

            <p className="text-5xl font-extrabold timer-display leading-none">
              {allDone ? "Fini !" : formatTime(timer.remainingSeconds)}
            </p>

            <p className="text-sm mt-1.5 opacity-80">{timer.label}</p>

            {timer.status === "active" && (
              <div className="mt-3 mx-auto max-w-[240px] h-1.5 bg-white/25 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${timer.progressPercent}%` }} />
              </div>
            )}

            {timer.status === "active" && ch.transport_to_next && nextCh && (
              <p className="text-[11px] mt-2.5 opacity-70">
                Ensuite : {ch.transport_to_next} vers {nextCh.company}
              </p>
            )}

            {timer.status === "in_transit" && ch && (
              <p className="text-[11px] mt-2 opacity-70">
                {ch.start_time} – {ch.end_time} · {ch.format}
              </p>
            )}
          </div>
        );
      })()}

      {/* 8 Challenges */}
      <div className="rounded-2xl bg-white border border-[#E8E2F4]/60 p-4 shadow-sm">
        <p className="text-[11px] font-bold text-[#5A4D80] uppercase tracking-widest mb-3">
          Vos 8 challenges
        </p>
        <div className="space-y-0.5">
          {challenges.map((ch, i) => {
            const isActive = isEventDay && i === timer.currentChallengeIndex && timer.status === "active";
            const isDone = isEventDay && i < timer.completedCount;
            const isExpanded = expandedId === ch.id;

            return (
              <div key={ch.id} ref={isActive ? activeRef : undefined} className="animate-stagger">
                <div className={`flex items-center gap-2 rounded-2xl transition-[background-color,border-color,padding,margin,box-shadow] duration-200 ${
                  isActive ? "bg-[#7A4AED]/8 border border-[#7A4AED]/25 p-1.5 -mx-1.5 shadow-sm" : "p-0.5"
                }`}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ch.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${ch.company} — ${ch.start_time} a ${ch.end_time}`}
                    className={`flex-1 flex items-center gap-2.5 py-2 rounded-xl px-2 pressable ${
                      isDone ? "opacity-40" : ""
                    }`}
                  >
                    <CompanyLogo src={ch.emoji ?? ""} company={ch.company} size={isActive ? 38 : 32} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold truncate ${isActive ? "text-sm text-[#7A4AED]" : "text-[13px] text-[#1A1035]"}`}>{ch.company}</p>
                        {isActive && (
                          <span className="text-[9px] font-bold text-white bg-[#7A4AED] px-2 py-0.5 rounded-full shrink-0 animate-breathe uppercase tracking-wider">
                            En cours
                          </span>
                        )}
                        {isDone && (
                          <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] ${isActive ? "text-[#7A4AED]/60" : "text-[#7C6FA0]"}`}>
                        <span className="font-semibold tabular-nums">{ch.start_time} – {ch.end_time}</span>
                        <span className="mx-1 opacity-40">·</span>{ch.format}
                      </p>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C6FA0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`shrink-0 transition-transform duration-200 ease-custom ${isExpanded ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  <a href={mapsLink(ch.address)} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 w-11 h-11 rounded-xl bg-[#F3F0FA] flex items-center justify-center text-sm pressable"
                    aria-label={`Localiser ${ch.company} sur la carte`}>
                    📍
                  </a>
                </div>

                {/* Expanded detail card */}
                {isExpanded && (
                  <div className="mt-1.5 mb-2 rounded-2xl border border-[#E8E2F4]/60 bg-white shadow-md shadow-[#7A4AED]/5 overflow-hidden animate-slide-up">

                    {/* Section 1 : Essentiel */}
                    <div className="bg-gradient-to-r from-[#7A4AED] to-[#9B73F2] text-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold tabular-nums">{ch.start_time} – {ch.end_time}</p>
                        <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold">{ch.position}/8</span>
                      </div>
                      <p className="text-sm opacity-80 mt-0.5">{ch.format} · {ch.prize}</p>
                    </div>

                    <div className="px-4 py-3 border-b border-[#E8E2F4]/60">
                      <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.challenge_description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {ch.skills.map((s) => (
                          <span key={s} className="text-[10px] bg-[#F3F0FA] text-[#7A4AED] px-2 py-0.5 rounded-md font-medium">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Section 2 : Preparation */}
                    {(ch.briefing_notes || ch.tips.length > 0) && (
                      <div className="px-4 py-3 border-b border-[#E8E2F4]/60 space-y-2.5">
                        <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider">Preparation</p>
                        {ch.briefing_notes && (
                          <div className="rounded-xl bg-[#FFE3E8]/60 px-3 py-2.5 border border-[#F46277]/10">
                            <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.briefing_notes}</p>
                          </div>
                        )}
                        {ch.tips.length > 0 && (
                          <ul className="space-y-1">
                            {ch.tips.map((t, ti) => (
                              <li key={ti} className="text-[13px] leading-snug pl-4 relative text-[#1A1035]/80">
                                <span className="absolute left-0 text-[#7A4AED]">•</span>{t}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Section 3 : Sur place */}
                    <div className="px-4 py-3 border-b border-[#E8E2F4]/60 space-y-2">
                      <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider">Sur place</p>
                      <a href={mapsLink(ch.address)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl bg-[#F3F0FA]/70 px-3 py-2.5 pressable border border-[#E8E2F4]/40">
                        <span className="text-base">📍</span>
                        <span className="text-[13px] text-[#1A1035] flex-1">{ch.address}</span>
                        <span className="text-[10px] text-[#7A4AED] font-semibold shrink-0">Ouvrir →</span>
                      </a>
                      <div className="px-1">
                        <p className="text-[10px] text-[#7C6FA0] uppercase tracking-wider font-semibold">Jury</p>
                        <p className="text-xs text-[#1A1035]/60 mt-0.5">{ch.jury.join(" · ")}</p>
                      </div>
                      {ch.contact_name && ch.contact_phone && (
                        <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2.5 rounded-xl bg-[#F3F0FA]/70 px-3 py-2.5 pressable border border-[#E8E2F4]/40">
                          <span className="text-base">📞</span>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-[#1A1035]">{ch.contact_name}</p>
                            <p className="text-[10px] text-[#7C6FA0]">{ch.contact_phone}</p>
                          </div>
                          <span className="text-[10px] text-[#7A4AED] font-semibold shrink-0">Appeler →</span>
                        </a>
                      )}
                    </div>

                    {/* Section 4 : Apres */}
                    {ch.transport_to_next && (
                      <div className="px-4 py-3 border-b border-[#E8E2F4]/60">
                        <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider mb-2">Ensuite</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm shrink-0 border border-amber-100" aria-hidden="true">🚶</div>
                          <p className="text-[13px] text-[#1A1035] flex-1">{ch.transport_to_next}</p>
                        </div>
                        {ch.directions_url && (
                          <a href={ch.directions_url} target="_blank" rel="noopener noreferrer"
                            className="mt-2.5 flex items-center justify-center gap-2 h-10 bg-gradient-to-r from-[#7A4AED] to-[#9B73F2] text-white rounded-xl text-xs font-semibold pressable shadow-sm shadow-[#7A4AED]/15"
                            aria-label={`Itineraire vers ${challenges[i + 1]?.company ?? "la prochaine etape"}`}>
                            📍 Voir l'itineraire
                          </a>
                        )}
                      </div>
                    )}

                    {/* Section 5 : Checklist */}
                    <div className="px-4 py-3">
                      <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider mb-2">Checklist</p>
                      <ChecklistTab challengeId={ch.id} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing event */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E8E2F4]/60">
          <div className="w-8 flex justify-center">
            <div className="w-2 h-2 rounded-full bg-[#F46277]/30" />
          </div>
          <p className="text-xs text-[#7C6FA0]/60">18h00 · Verre de cloture</p>
        </div>
      </div>

      {/* Contacts */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-bold text-[#5A4D80] uppercase tracking-widest">
          Contacts importants
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {CONTACTS.map((c) => (
            <a key={c.name}
              href={c.phone.startsWith("+") ? `tel:${c.phone.replace(/\s/g, "")}` : undefined}
              className="rounded-2xl bg-white border border-[#E8E2F4]/60 p-3.5 shadow-sm pressable">
              <p className="text-sm font-bold text-[#1A1035]">{c.name}</p>
              <p className="text-[10px] text-[#7C6FA0] mt-0.5">{c.role}</p>
              <p className="text-xs text-[#7A4AED] font-semibold mt-2">{c.phone}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Quick photo */}
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full h-11 rounded-2xl bg-white border border-[#E8E2F4]/60 text-sm font-medium text-[#7C6FA0] shadow-sm pressable disabled:opacity-50">
        {uploading ? "Envoi..." : "📷 Prendre une photo"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />

      {/* Manual nav (event day) */}
      {isEventDay && (
        <div className="flex gap-2">
          <button onClick={timer.goPrev} disabled={timer.currentChallengeIndex === 0}
            className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4]/60 text-xs font-semibold text-[#1A1035] disabled:opacity-20 pressable shadow-sm">
            ← Prec.
          </button>
          {timer.status === "active" && (
            <button onClick={timer.goNext}
              className="h-11 px-4 rounded-xl bg-emerald-500 text-white text-xs font-semibold pressable shadow-sm">
              Termine ✓
            </button>
          )}
          {timer.isManualOverride && (
            <button onClick={timer.resetToAuto} className="h-11 px-3 rounded-xl bg-[#F3F0FA] text-[#7A4AED] text-xs font-semibold">Auto</button>
          )}
          <button onClick={timer.goNext} disabled={timer.currentChallengeIndex === challenges.length - 1}
            className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4]/60 text-xs font-semibold text-[#1A1035] disabled:opacity-20 pressable shadow-sm">
            Suiv. →
          </button>
        </div>
      )}
    </div>
  );
}
