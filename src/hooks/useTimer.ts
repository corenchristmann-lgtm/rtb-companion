"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChallengeStatusType } from "@/types/database";

const EVENT_DATE = "2026-04-13";

interface ChallengeInput {
  start_time: string;
  end_time: string;
}

interface TimerState {
  currentChallengeIndex: number;
  status: ChallengeStatusType;
  remainingSeconds: number;
  progressPercent: number;
  label: string;
  isEventDay: boolean;
  daysUntilEvent: number;
}

function timeToSeconds(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 3600 + m * 60;
}

function getSecondsFromMidnight(d: Date): number {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

function isToday(dateStr: string): boolean {
  const n = new Date();
  const y = n.getFullYear(), m = String(n.getMonth() + 1).padStart(2, "0"), d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}` === dateStr;
}

function daysUntil(dateStr: string): number {
  const n = new Date(); n.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr + "T00:00:00").getTime() - n.getTime()) / 86400000);
}

export function useTimer(challenges: ChallengeInput[]) {
  const [state, setState] = useState<TimerState>({
    currentChallengeIndex: 0, status: "upcoming", remainingSeconds: 0,
    progressPercent: 0, label: "", isEventDay: false, daysUntilEvent: 0,
  });
  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const alertedRef = useRef<Set<string>>(new Set());

  const vibrate = useCallback((p: number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(p);
  }, []);
  const triggerAlert = useCallback((key: string, p: number[]) => {
    if (!alertedRef.current.has(key)) { alertedRef.current.add(key); vibrate(p); }
  }, [vibrate]);
  const goToChallenge = useCallback((i: number) => { setManualOverride(i); alertedRef.current.clear(); }, []);
  const goNext = useCallback(() => {
    const c = manualOverride ?? state.currentChallengeIndex;
    if (c < challenges.length - 1) goToChallenge(c + 1);
  }, [manualOverride, state.currentChallengeIndex, challenges.length, goToChallenge]);
  const goPrev = useCallback(() => {
    const c = manualOverride ?? state.currentChallengeIndex;
    if (c > 0) goToChallenge(c - 1);
  }, [manualOverride, state.currentChallengeIndex, goToChallenge]);
  const resetToAuto = useCallback(() => { setManualOverride(null); alertedRef.current.clear(); }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const nowSec = getSecondsFromMidnight(now);
      const eventDay = isToday(EVENT_DATE);
      const days = daysUntil(EVENT_DATE);

      let idx = manualOverride ?? 0;
      let status: ChallengeStatusType = "upcoming";
      let remainingSeconds = 0, progressPercent = 0, label = "";

      if (challenges.length === 0) {
        label = eventDay ? "Sélectionne ton équipe" : (days > 0 ? `J-${days} avant le RTB` : "Le RTB est passé");
        setState({ currentChallengeIndex: 0, status: "upcoming", remainingSeconds: 0, progressPercent: 0, label, isEventDay: eventDay, daysUntilEvent: days });
        return;
      }

      if (!eventDay && manualOverride === null) {
        label = days > 0 ? (days === 1 ? "C'est demain !" : `J-${days} avant le RTB`) : "Le RTB est passé";
        setState({ currentChallengeIndex: 0, status: "upcoming", remainingSeconds: 0, progressPercent: 0, label, isEventDay: false, daysUntilEvent: days });
        return;
      }

      if (manualOverride !== null) {
        idx = manualOverride;
        const ch = challenges[idx];
        const s = timeToSeconds(ch.start_time), e = timeToSeconds(ch.end_time);
        if (eventDay && nowSec < s) { status = "in_transit"; remainingSeconds = s - nowSec; label = `Départ dans ${formatTime(remainingSeconds)}`; }
        else if (eventDay && nowSec < e) { status = "active"; remainingSeconds = e - nowSec; progressPercent = ((nowSec - s) / (e - s)) * 100; label = `${formatTime(remainingSeconds)} restantes`; }
        else { status = eventDay ? "completed" : "upcoming"; label = eventDay ? "Terminé" : `Aperçu`; progressPercent = eventDay ? 100 : 0; }
      } else {
        let found = false;
        for (let i = 0; i < challenges.length; i++) {
          const ch = challenges[i];
          const s = timeToSeconds(ch.start_time), e = timeToSeconds(ch.end_time);
          if (nowSec < s) {
            idx = i; status = "in_transit"; remainingSeconds = s - nowSec;
            label = `Début dans ${formatTime(remainingSeconds)}`; found = true;
            if (remainingSeconds <= 300) triggerAlert(`pre-${i}`, [200, 100, 200, 100, 200]);
            break;
          } else if (nowSec < e) {
            idx = i; status = "active"; remainingSeconds = e - nowSec;
            progressPercent = ((nowSec - s) / (e - s)) * 100;
            label = `${formatTime(remainingSeconds)} restantes`; found = true;
            triggerAlert(`start-${i}`, [500, 200, 500]);
            if (remainingSeconds <= 300) triggerAlert(`warn-${i}`, [200, 100, 200, 100, 200, 100, 200]);
            if (remainingSeconds <= 60) triggerAlert(`urgent-${i}`, [500, 200, 500, 200, 500]);
            break;
          }
        }
        if (!found) {
          if (nowSec >= timeToSeconds(challenges[challenges.length - 1].end_time)) {
            idx = challenges.length - 1; status = "completed"; label = "Journée terminée !"; progressPercent = 100;
          } else {
            idx = 0; status = "upcoming"; remainingSeconds = timeToSeconds(challenges[0].start_time) - nowSec;
            label = `Début dans ${formatTime(remainingSeconds)}`;
          }
        }
      }
      setState({ currentChallengeIndex: idx, status, remainingSeconds, progressPercent, label, isEventDay: eventDay, daysUntilEvent: days });
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [manualOverride, triggerAlert, challenges]);

  return {
    ...state,
    isManualOverride: manualOverride !== null,
    goNext, goPrev, goToChallenge, resetToAuto,
    completedCount: state.status === "completed" ? state.currentChallengeIndex + 1 : state.currentChallengeIndex,
  };
}

export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0:00";
  const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = totalSeconds % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
