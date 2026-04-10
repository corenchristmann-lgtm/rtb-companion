"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTACTS } from "@/lib/teams";
import type { Team } from "@/lib/teams";
import { formatTime } from "@/hooks/useTimer";
import { ChecklistTab } from "./ChecklistTab";
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
  onOpenChallenge: (id: number) => void;
  onLogout: () => void;
}

export function NowScreen({ timer, challenges, team, onOpenChallenge, onLogout }: Props) {
  const ch = challenges[timer.currentChallengeIndex];
  const [panel, setPanel] = useState<"none" | "tips" | "checklist">("none");
  if (!ch) return null;

  const isActive = timer.status === "active";
  const isTransit = timer.status === "in_transit";
  const isDone = timer.status === "completed";
  const urgent = isActive && timer.remainingSeconds <= 300;
  const togglePanel = (p: "tips" | "checklist") => setPanel(panel === p ? "none" : p);

  // Pre-event screen
  if (!timer.isEventDay && !timer.isManualOverride) {
    return (
      <div className="px-4 pt-10 pb-4 max-w-lg mx-auto text-center space-y-6">
        <div className="flex justify-center mb-2">
          <Image src="/logos/venturelab.svg" alt="VentureLab" width={140} height={46} unoptimized />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1A1035]">Road-to-Business</h1>
          <p className="text-xs text-[#7C6FA0] mt-0.5">{team.name} · {team.accompanist}</p>
        </div>
        <div className="py-6">
          <p className="text-6xl font-extrabold text-[#7A4AED] timer-display">
            {timer.daysUntilEvent > 0 ? `J-${timer.daysUntilEvent}` : "✓"}
          </p>
          <p className="text-sm text-[#7C6FA0] mt-3">{timer.label}</p>
          <p className="text-xs text-[#7C6FA0] mt-1">Lundi 13 avril 2026 · Liège</p>
        </div>
        <div className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm text-left">
          <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest mb-3">Vos 8 challenges</p>
          <div className="space-y-2">
            {challenges.map((c) => (
              <button key={c.id} onClick={() => onOpenChallenge(c.id)}
                className="w-full flex items-center gap-2.5 py-1.5 active:scale-[0.98] transition-transform">
                <CompanyLogo src={c.emoji ?? ""} company={c.company} size={30} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-[#1A1035] truncate">{c.company}</p>
                  <p className="text-[10px] text-[#7C6FA0]">{c.start_time} · {c.format}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CONTACTS.map((c) => (
            <a key={c.name} href={c.phone.startsWith("+") ? `tel:${c.phone.replace(/\s/g, "")}` : undefined}
              className="shrink-0 rounded-xl border border-[#E8E2F4] bg-white px-3.5 py-2.5 min-w-[130px] shadow-sm text-left">
              <p className="text-xs font-semibold text-[#1A1035]">{c.name}</p>
              <p className="text-[10px] text-[#7C6FA0]">{c.role}</p>
            </a>
          ))}
        </div>
        <button onClick={onLogout} className="text-[11px] text-[#7C6FA0] underline">Changer d'équipe</button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${
            isActive ? (urgent ? "bg-[#F46277] animate-breathe" : "bg-[#7A4AED] animate-breathe") :
            isTransit ? "bg-amber-500" : isDone ? "bg-emerald-500" : "bg-gray-300"
          }`} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${
            isActive ? (urgent ? "text-[#F46277]" : "text-[#7A4AED]") :
            isTransit ? "text-amber-600" : isDone ? "text-emerald-600" : "text-gray-400"
          }`}>
            {isActive ? (urgent ? "Fin imminente" : "En cours") :
             isTransit ? "En transit" : isDone ? "Terminé" : "À venir"}
          </span>
          <span className="text-[10px] text-[#7C6FA0]">· {team.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {challenges.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${
              i < timer.completedCount ? "bg-emerald-500" :
              i === timer.currentChallengeIndex ? "bg-[#7A4AED]" : "bg-gray-200"
            }`} />
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center py-4">
        <p className={`text-7xl font-extrabold timer-display leading-none ${
          urgent ? "text-[#F46277]" : isActive ? "text-[#1A1035]" : "text-gray-300"
        }`}>{isDone ? "✓" : formatTime(timer.remainingSeconds)}</p>
        <p className="text-sm text-[#7C6FA0] mt-3">{timer.label}</p>
        {isActive && (
          <div className="mt-4 mx-auto max-w-[240px] h-1.5 bg-[#F3F0FA] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${urgent ? "bg-[#F46277]" : "bg-[#7A4AED]"}`}
              style={{ width: `${timer.progressPercent}%` }} />
          </div>
        )}
      </div>

      {/* Challenge card */}
      <div onClick={() => onOpenChallenge(ch.id)}
        className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
        <div className="flex items-start gap-3">
          <CompanyLogo src={ch.emoji ?? ""} company={ch.company} size={44} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#7C6FA0] mb-0.5">Challenge {ch.position}/8</p>
            <p className="text-base font-bold leading-tight text-[#1A1035]">{ch.company}</p>
            <p className="text-xs text-[#7C6FA0] mt-1">{ch.start_time} – {ch.end_time} · {ch.location}</p>
          </div>
        </div>
        <p className="text-[13px] text-[#1A1035]/70 mt-3 leading-relaxed">{ch.challenge_description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#7A4AED] bg-[#F3F0FA] px-2 py-0.5 rounded-md">{ch.format}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2.5">
        <button onClick={() => togglePanel("tips")}
          className={`rounded-2xl py-3.5 text-center transition-all active:scale-95 ${
            panel === "tips" ? "bg-[#7A4AED] text-white shadow-lg shadow-[#7A4AED]/25" : "bg-white border border-[#E8E2F4] shadow-sm"
          }`}>
          <span className="text-lg block mb-0.5">💡</span>
          <span className="text-[10px] font-semibold">Tips</span>
        </button>
        <button onClick={() => togglePanel("checklist")}
          className={`rounded-2xl py-3.5 text-center transition-all active:scale-95 ${
            panel === "checklist" ? "bg-[#7A4AED] text-white shadow-lg shadow-[#7A4AED]/25" : "bg-white border border-[#E8E2F4] shadow-sm"
          }`}>
          <span className="text-lg block mb-0.5">✅</span>
          <span className="text-[10px] font-semibold">Checklist</span>
        </button>
        {ch.contact_phone ? (
          <a href={`tel:${ch.contact_phone.replace(/\s/g, "")}`}
            className="rounded-2xl py-3.5 text-center bg-white border border-[#E8E2F4] shadow-sm active:scale-95 transition-transform">
            <span className="text-lg block mb-0.5">📞</span>
            <span className="text-[10px] font-semibold">Appeler</span>
          </a>
        ) : <div />}
      </div>

      {/* Panels */}
      {panel === "tips" && (
        <div className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm animate-slide-up space-y-4">
          {ch.briefing_notes && (
            <div className="rounded-xl bg-[#FFE3E8] p-3">
              <p className="text-[10px] font-bold text-[#F46277] uppercase tracking-widest mb-1">Briefing</p>
              <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.briefing_notes}</p>
            </div>
          )}
          <ul className="space-y-2">
            {ch.tips.map((t, i) => (
              <li key={i} className="text-[13px] leading-relaxed pl-4 relative">
                <span className="absolute left-0 text-[#7A4AED] font-bold">›</span>{t}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {ch.skills.map((s) => (
              <span key={s} className="text-[10px] bg-[#F3F0FA] text-[#7A4AED] px-2 py-0.5 rounded-md font-medium">{s}</span>
            ))}
          </div>
          <p className="text-[13px] text-[#1A1035]/60"><strong className="text-[10px] uppercase tracking-widest text-[#7C6FA0]">Jury : </strong>{ch.jury.join(" · ")}</p>
        </div>
      )}
      {panel === "checklist" && <div className="animate-slide-up"><ChecklistTab challengeId={ch.id} /></div>}

      {/* Nav */}
      <div className="flex gap-2.5">
        <button onClick={timer.goPrev} disabled={timer.currentChallengeIndex === 0}
          className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4] text-xs font-semibold text-[#1A1035] disabled:opacity-20 active:scale-95 transition-transform shadow-sm">← Précédent</button>
        {timer.isManualOverride && (
          <button onClick={timer.resetToAuto} className="h-11 px-4 rounded-xl bg-[#F3F0FA] text-[#7A4AED] text-xs font-semibold">Auto</button>
        )}
        <button onClick={timer.goNext} disabled={timer.currentChallengeIndex === challenges.length - 1}
          className="flex-1 h-11 rounded-xl bg-white border border-[#E8E2F4] text-xs font-semibold text-[#1A1035] disabled:opacity-20 active:scale-95 transition-transform shadow-sm">Suivant →</button>
      </div>

      {/* Transport */}
      {ch.transport_to_next && (
        <div className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-[#7C6FA0] uppercase tracking-widest mb-1">Comment aller au prochain atelier</p>
          <p className="text-[13px] leading-relaxed text-[#1A1035]">{ch.transport_to_next}</p>
          {ch.directions_url && (
            <a href={ch.directions_url} target="_blank" rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-2 h-11 bg-[#7A4AED] text-white rounded-xl text-sm font-semibold shadow-sm shadow-[#7A4AED]/20 active:scale-95 transition-transform">
              📍 Itinéraire vers le prochain atelier
            </a>
          )}
        </div>
      )}

      {/* Contacts */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CONTACTS.map((c) => (
          <a key={c.name} href={c.phone.startsWith("+") ? `tel:${c.phone.replace(/\s/g, "")}` : undefined}
            className="shrink-0 rounded-xl border border-[#E8E2F4] bg-white px-3.5 py-2.5 min-w-[130px] shadow-sm">
            <p className="text-xs font-semibold text-[#1A1035]">{c.name}</p>
            <p className="text-[10px] text-[#7C6FA0]">{c.role}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
