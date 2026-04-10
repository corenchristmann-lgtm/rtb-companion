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
      <div className="text-center py-3">
        {!isEventDay ? (
          <>
            <p className="text-5xl font-extrabold text-[#7A4AED] timer-display">
              {timer.daysUntilEvent > 0 ? `J-${timer.daysUntilEvent}` : "RTB terminé"}
            </p>
            <p className="text-sm text-[#7C6FA0] mt-2">{timer.label}</p>
            <p className="text-xs text-[#7C6FA0] mt-0.5">Lundi 13 avril 2026 · Liege</p>
          </>
        ) : (
          <>
            <p className={`text-5xl font-extrabold timer-display ${
              timer.status === "active" && timer.remainingSeconds <= 300 ? "text-[#F46277]" :
              timer.status === "active" ? "text-[#1A1035]" : "text-[#7A4AED]"
            }`}>
              {timer.status === "completed" && timer.currentChallengeIndex === challenges.length - 1
                ? "Fini !" : formatTime(timer.remainingSeconds)}
            </p>
            <p className="text-sm text-[#7C6FA0] mt-2">{timer.label}</p>
            {timer.status === "active" && (
              <div className="mt-3 mx-auto max-w-[240px] h-1.5 bg-[#F3F0FA] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timer.remainingSeconds <= 300 ? "bg-[#F46277]" : "bg-[#7A4AED]"
                }`} style={{ width: `${timer.progressPercent}%` }} />
              </div>
            )}
          </>
        )}
      </div>

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
                  <div className="ml-2 mr-12 mt-1 mb-3 rounded-2xl border border-[#E8E2F4] bg-[#FAFAFE] p-4 space-y-3 animate-slide-up">
                    {/* Time banner */}
                    <div className="flex items-center justify-between bg-[#7A4AED] text-white rounded-xl px-4 py-2.5">
                      <div>
                        <p className="text-lg font-bold tabular-nums">{ch.start_time} – {ch.end_time}</p>
                        <p className="text-[10px] opacity-80">{ch.format}</p>
                      </div>
                      <p className="text-2xl">{ch.position}/8</p>
                    </div>

                    {/* Description */}
                    <div className="rounded-xl bg-[#F3F0FA] p-3">
                      <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.challenge_description}</p>
                    </div>

                    {/* Briefing */}
                    {ch.briefing_notes && (
                      <div className="rounded-xl bg-[#FFE3E8] p-3">
                        <p className="text-[10px] font-bold text-[#F46277] uppercase tracking-widest mb-1">Briefing</p>
                        <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.briefing_notes}</p>
                      </div>
                    )}

                    {/* Tips */}
                    <div>
                      <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest mb-1.5">Conseils</p>
                      <ul className="space-y-1.5">
                        {ch.tips.map((t, ti) => (
                          <li key={ti} className="text-[13px] leading-relaxed pl-3.5 relative text-[#1A1035]/80">
                            <span className="absolute left-0 text-[#7A4AED] font-bold">›</span>{t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {ch.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-[#F3F0FA] text-[#7A4AED] px-2 py-0.5 rounded-md font-medium">{s}</span>
                      ))}
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest">Lieu</p>
                      <a href={mapsLink(ch.address)} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#7A4AED] font-medium mt-0.5 block">
                        📍 {ch.address}
                      </a>
                    </div>

                    {/* Jury */}
                    <div>
                      <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest">Jury</p>
                      <p className="text-[13px] text-[#1A1035]/60 mt-0.5">{ch.jury.join(" · ")}</p>
                    </div>

                    {/* Contact */}
                    {ch.contact_name && ch.contact_phone && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest">Contact</p>
                          <p className="text-sm text-[#1A1035]">{ch.contact_name}</p>
                        </div>
                        <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
                          className="text-xs text-white bg-[#7A4AED] px-3 py-2 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform">
                          📞 Appeler
                        </a>
                      </div>
                    )}

                    {/* Transport */}
                    {ch.transport_to_next && (
                      <div className="rounded-xl bg-[#F3F0FA] p-3">
                        <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest mb-0.5">Vers le prochain atelier</p>
                        <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.transport_to_next}</p>
                        {ch.directions_url && (
                          <a href={ch.directions_url} target="_blank" rel="noopener noreferrer"
                            className="mt-2 flex items-center justify-center gap-2 h-10 bg-[#7A4AED] text-white rounded-xl text-xs font-semibold active:scale-95 transition-transform">
                            📍 Itineraire
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
