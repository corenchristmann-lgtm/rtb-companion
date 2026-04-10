"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CONTACTS } from "@/lib/teams";
import type { Team } from "@/lib/teams";
import { formatTime } from "@/hooks/useTimer";
import { usePhotos } from "@/hooks/useSupabase";
import { CompanyLogo } from "./CompanyLogo";

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

  // Auto-scroll to active challenge on event day
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
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="relative">
        <button onClick={onLogout} className="absolute right-0 top-1 text-[11px] text-[#7C6FA0] underline">
          Changer d'equipe
        </button>
        <div className="flex justify-center">
          <Image src="/logos/venturelab.svg" alt="VentureLab" width={140} height={46} unoptimized />
        </div>
        <div className="text-center mt-2">
          <h1 className="text-lg font-bold text-[#1A1035]">Road-to-Business</h1>
          <p className="text-xs text-[#7C6FA0] mt-0.5">{team.name} · {team.accompanist}</p>
        </div>
      </div>

      {/* Countdown / Status */}
      {!isEventDay ? (
        <div className="text-center py-3">
          <p className="text-5xl font-extrabold text-[#7A4AED] timer-display">
            {timer.daysUntilEvent > 0 ? `J-${timer.daysUntilEvent}` : "RTB termine"}
          </p>
          <p className="text-sm text-[#7C6FA0] mt-2">{timer.label}</p>
          <p className="text-xs text-[#7C6FA0] mt-0.5">Lundi 13 avril 2026 · Liege</p>
        </div>
      ) : (() => {
        const ch = challenges[timer.currentChallengeIndex];
        const nextCh = challenges[timer.currentChallengeIndex + 1];
        const allDone = timer.status === "completed" && timer.currentChallengeIndex === challenges.length - 1;
        const urgent = timer.status === "active" && timer.remainingSeconds <= 300;

        return (
          <div className={`rounded-2xl p-4 text-center ${
            urgent ? "bg-[#F46277]/10 border border-[#F46277]/30" :
            timer.status === "active" ? "bg-[#7A4AED]/5 border border-[#7A4AED]/20" :
            timer.status === "in_transit" ? "bg-amber-50 border border-amber-200" :
            "bg-[#F3F0FA]"
          }`}>
            {/* Current challenge name */}
            {ch && !allDone && (
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                urgent ? "text-[#F46277]" :
                timer.status === "active" ? "text-[#7A4AED]" :
                timer.status === "in_transit" ? "text-amber-600" : "text-[#7C6FA0]"
              }`}>
                {timer.status === "active" ? ch.company : timer.status === "in_transit" ? `Prochain : ${ch.company}` : ch.company}
              </p>
            )}

            {/* Timer */}
            <p className={`text-5xl font-extrabold timer-display leading-none ${
              allDone ? "text-emerald-500" :
              urgent ? "text-[#F46277]" :
              timer.status === "active" ? "text-[#1A1035]" :
              timer.status === "in_transit" ? "text-amber-600" : "text-[#7A4AED]"
            }`}>
              {allDone ? "Fini !" : formatTime(timer.remainingSeconds)}
            </p>

            {/* Label */}
            <p className="text-sm text-[#7C6FA0] mt-1.5">{timer.label}</p>

            {/* Progress bar (active only) */}
            {timer.status === "active" && (
              <div className="mt-3 mx-auto max-w-[240px] h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  urgent ? "bg-[#F46277]" : "bg-[#7A4AED]"
                }`} style={{ width: `${timer.progressPercent}%` }} />
              </div>
            )}

            {/* What's next after this challenge */}
            {timer.status === "active" && ch.transport_to_next && nextCh && (
              <p className="text-[11px] text-[#7C6FA0] mt-2.5">
                Ensuite : <span className="font-semibold text-[#1A1035]">{ch.transport_to_next}</span> vers {nextCh.company}
              </p>
            )}

            {/* During transit, show destination info */}
            {timer.status === "in_transit" && ch && (
              <p className="text-[11px] text-[#7C6FA0] mt-2">
                {ch.start_time} – {ch.end_time} · {ch.format}
              </p>
            )}
          </div>
        );
      })()}

      {/* 8 Challenges */}
      <div className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest mb-3">
          Vos 8 challenges
        </p>
        <div className="space-y-1">
          {challenges.map((ch, i) => {
            const isActive = isEventDay && i === timer.currentChallengeIndex && timer.status === "active";
            const isDone = isEventDay && i < timer.completedCount;
            const isExpanded = expandedId === ch.id;

            return (
              <div key={ch.id} ref={isActive ? activeRef : undefined}>
                {/* Challenge row */}
                <div className={`flex items-center gap-2.5 rounded-2xl transition-all ${
                  isActive ? "bg-[#7A4AED]/10 border-2 border-[#7A4AED]/40 p-1.5 -mx-1.5 shadow-md shadow-[#7A4AED]/10" : ""
                }`}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ch.id)}
                    className={`flex-1 flex items-center gap-2.5 py-2 rounded-xl px-2 active:scale-[0.98] transition-all ${
                      isDone ? "opacity-50" : ""
                    }`}
                  >
                    <CompanyLogo src={ch.emoji ?? ""} company={ch.company} size={isActive ? 40 : 34} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold truncate ${isActive ? "text-base text-[#7A4AED]" : "text-sm text-[#1A1035]"}`}>{ch.company}</p>
                        {isActive && (
                          <span className="text-[8px] font-bold text-white bg-[#7A4AED] px-1.5 py-0.5 rounded-full shrink-0 animate-breathe">
                            EN COURS
                          </span>
                        )}
                        {isDone && (
                          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] ${isActive ? "text-[#7A4AED]/70 font-medium" : "text-[#7C6FA0]"}`}>
                        <span className="font-semibold tabular-nums">{ch.start_time} – {ch.end_time}</span>
                        {" · "}{ch.format}
                      </p>
                    </div>
                    <span className="text-[#7C6FA0] text-xs shrink-0">{isExpanded ? "▴" : "▾"}</span>
                  </button>

                  {/* Maps button */}
                  <a href={mapsLink(ch.address)} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 w-9 h-9 rounded-lg bg-[#F3F0FA] flex items-center justify-center text-base active:scale-90 transition-transform">
                    📍
                  </a>
                </div>

                {/* Expanded detail card */}
                {isExpanded && (
                  <div className="mt-2 mb-3 rounded-2xl border border-[#E8E2F4] bg-white shadow-sm overflow-hidden animate-slide-up">

                    {/* ── SECTION 1 : L'essentiel ── */}
                    <div className="bg-[#7A4AED] text-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold tabular-nums">{ch.start_time} – {ch.end_time}</p>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{ch.position}/8</span>
                      </div>
                      <p className="text-sm opacity-90 mt-0.5">{ch.format} · {ch.prize}</p>
                    </div>

                    <div className="px-4 py-3 border-b border-[#E8E2F4]">
                      <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.challenge_description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {ch.skills.map((s) => (
                          <span key={s} className="text-[10px] bg-[#F3F0FA] text-[#7A4AED] px-2 py-0.5 rounded-md font-medium">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* ── SECTION 2 : Preparation ── */}
                    {(ch.briefing_notes || ch.tips.length > 0) && (
                      <div className="px-4 py-3 border-b border-[#E8E2F4] space-y-2.5">
                        <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider">Preparation</p>

                        {ch.briefing_notes && (
                          <div className="rounded-xl bg-[#FFE3E8] px-3 py-2.5">
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

                    {/* ── SECTION 3 : Sur place ── */}
                    <div className="px-4 py-3 border-b border-[#E8E2F4] space-y-2.5">
                      <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider">Sur place</p>

                      <a href={mapsLink(ch.address)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-[#F3F0FA] px-3 py-2.5 active:scale-[0.98] transition-transform">
                        <span className="text-base">📍</span>
                        <span className="text-sm text-[#1A1035] flex-1">{ch.address}</span>
                        <span className="text-[10px] text-[#7A4AED] font-semibold shrink-0">Ouvrir</span>
                      </a>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#7C6FA0] uppercase tracking-wider font-semibold">Jury</p>
                          <p className="text-xs text-[#1A1035]/70 mt-0.5">{ch.jury.join(" · ")}</p>
                        </div>
                      </div>

                      {ch.contact_name && ch.contact_phone && (
                        <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 rounded-xl bg-[#F3F0FA] px-3 py-2.5 active:scale-[0.98] transition-transform">
                          <span className="text-base">📞</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1A1035]">{ch.contact_name}</p>
                            <p className="text-[10px] text-[#7C6FA0]">{ch.contact_phone}</p>
                          </div>
                          <span className="text-[10px] text-[#7A4AED] font-semibold shrink-0">Appeler</span>
                        </a>
                      )}
                    </div>

                    {/* ── SECTION 4 : Apres ── */}
                    {ch.transport_to_next && (
                      <div className="px-4 py-3">
                        <p className="text-[11px] font-bold text-[#7A4AED] uppercase tracking-wider mb-2">Ensuite</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-base shrink-0">🚶</div>
                          <p className="text-sm text-[#1A1035] flex-1">{ch.transport_to_next}</p>
                        </div>
                        {ch.directions_url && (
                          <a href={ch.directions_url} target="_blank" rel="noopener noreferrer"
                            className="mt-2.5 flex items-center justify-center gap-2 h-10 bg-[#7A4AED] text-white rounded-xl text-xs font-semibold active:scale-95 transition-transform">
                            📍 Voir l'itineraire
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing event */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E8E2F4]">
          <div className="w-[34px] flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFE3E8]" />
          </div>
          <p className="text-xs text-[#7C6FA0]">18h00 · Verre de cloture</p>
        </div>
      </div>

      {/* Contacts — Morgane & Robin */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest">
          Contacts importants
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CONTACTS.map((c) => (
            <a key={c.name}
              href={c.phone.startsWith("+") ? `tel:${c.phone.replace(/\s/g, "")}` : undefined}
              className="rounded-2xl border border-[#E8E2F4] bg-white p-3.5 shadow-sm active:scale-[0.98] transition-transform">
              <p className="text-sm font-bold text-[#1A1035]">{c.name}</p>
              <p className="text-[10px] text-[#7C6FA0] mt-0.5">{c.role}</p>
              <p className="text-xs text-[#7A4AED] font-semibold mt-1.5">{c.phone}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Quick photo */}
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full h-11 rounded-2xl bg-white border border-[#E8E2F4] text-sm font-semibold text-[#7C6FA0] shadow-sm active:scale-[0.98] transition-transform disabled:opacity-50">
        {uploading ? "Envoi..." : "📷 Prendre une photo"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />

      {/* Manual nav (event day) */}
      {isEventDay && (
        <div className="flex gap-2">
          <button onClick={timer.goPrev} disabled={timer.currentChallengeIndex === 0}
            className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4] text-xs font-semibold text-[#1A1035] disabled:opacity-20 active:scale-95 transition-transform shadow-sm">
            ← Prec.
          </button>
          {timer.status === "active" && (
            <button onClick={timer.goNext}
              className="h-11 px-4 rounded-xl bg-emerald-500 text-white text-xs font-semibold active:scale-95 transition-transform shadow-sm">
              Termine ✓
            </button>
          )}
          {timer.isManualOverride && (
            <button onClick={timer.resetToAuto} className="h-11 px-3 rounded-xl bg-[#F3F0FA] text-[#7A4AED] text-xs font-semibold">Auto</button>
          )}
          <button onClick={timer.goNext} disabled={timer.currentChallengeIndex === challenges.length - 1}
            className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4] text-xs font-semibold text-[#1A1035] disabled:opacity-20 active:scale-95 transition-transform shadow-sm">
            Suiv. →
          </button>
        </div>
      )}
    </div>
  );
}
