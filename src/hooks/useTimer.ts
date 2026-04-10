"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CHALLENGES } from "@/lib/data";
import type { ChallengeStatusType } from "@/types/database";

// Date de l'événement RTB — lundi 13 avril 2026
const EVENT_DATE = "2026-04-13";

interface TimerState {
  currentChallengeIndex: number;
  status: ChallengeStatusType;
  remainingSeconds: number;
  progressPercent: number;
  label: string;
  isEventDay: boolean;
  daysUntilEvent: number;
}

function timeToSeconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

function getSecondsFromMidnight(date: Date): number {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

function isToday(dateStr: string): boolean {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}` === dateStr;
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    currentChallengeIndex: 0,
    status: "upcoming",
    remainingSeconds: 0,
    progressPercent: 0,
    label: "",
    isEventDay: false,
    daysUntilEvent: 0,
  });
  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const alertedRef = useRef<Set<string>>(new Set());

  const vibrate = useCallback((pattern: number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const triggerAlert = useCallback((key: string, pattern: number[]) => {
    if (!alertedRef.current.has(key)) {
      alertedRef.current.add(key);
      vibrate(pattern);
    }
  }, [vibrate]);

  const goToChallenge = useCallback((index: number) => {
    setManualOverride(index);
    alertedRef.current.clear();
  }, []);

  const goNext = useCallback(() => {
    const current = manualOverride ?? state.currentChallengeIndex;
    if (current < CHALLENGES.length - 1) goToChallenge(current + 1);
  }, [manualOverride, state.currentChallengeIndex, goToChallenge]);

  const goPrev = useCallback(() => {
    const current = manualOverride ?? state.currentChallengeIndex;
    if (current > 0) goToChallenge(current - 1);
  }, [manualOverride, state.currentChallengeIndex, goToChallenge]);

  const resetToAuto = useCallback(() => {
    setManualOverride(null);
    alertedRef.current.clear();
  }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const nowSec = getSecondsFromMidnight(now);
      const eventDay = isToday(EVENT_DATE);
      const days = daysUntil(EVENT_DATE);

      let idx = manualOverride ?? 0;
      let status: ChallengeStatusType = "upcoming";
      let remainingSeconds = 0;
      let progressPercent = 0;
      let label = "";

      // Before event day and no manual override: show countdown to event
      if (!eventDay && manualOverride === null) {
        idx = 0;
        status = "upcoming";
        remainingSeconds = 0;
        progressPercent = 0;
        if (days > 0) {
          label = days === 1 ? "C'est demain !" : `J-${days} avant le RTB`;
        } else {
          label = "Le RTB est passé";
        }
        setState({ currentChallengeIndex: idx, status, remainingSeconds, progressPercent, label, isEventDay: eventDay, daysUntilEvent: days });
        return;
      }

      if (manualOverride !== null) {
        idx = manualOverride;
        const ch = CHALLENGES[idx];
        const startSec = timeToSeconds(ch.start_time);
        const endSec = timeToSeconds(ch.end_time);
        const duration = endSec - startSec;

        if (eventDay && nowSec < startSec) {
          status = "in_transit";
          remainingSeconds = startSec - nowSec;
          label = `Départ dans ${formatTime(remainingSeconds)}`;
        } else if (eventDay && nowSec < endSec) {
          status = "active";
          remainingSeconds = endSec - nowSec;
          progressPercent = ((nowSec - startSec) / duration) * 100;
          label = `${formatTime(remainingSeconds)} restantes`;
        } else {
          status = eventDay ? "completed" : "upcoming";
          remainingSeconds = 0;
          progressPercent = eventDay ? 100 : 0;
          label = eventDay ? "Terminé" : `Aperçu : ${ch.company}`;
        }
      } else {
        // Auto-detect on event day
        let found = false;
        for (let i = 0; i < CHALLENGES.length; i++) {
          const ch = CHALLENGES[i];
          const startSec = timeToSeconds(ch.start_time);
          const endSec = timeToSeconds(ch.end_time);

          if (nowSec < startSec) {
            idx = i;
            status = "in_transit";
            remainingSeconds = startSec - nowSec;
            label = `Début dans ${formatTime(remainingSeconds)}`;
            found = true;

            if (remainingSeconds <= 300) triggerAlert(`pre-${i}`, [200, 100, 200, 100, 200]);
            break;
          } else if (nowSec >= startSec && nowSec < endSec) {
            idx = i;
            status = "active";
            remainingSeconds = endSec - nowSec;
            progressPercent = ((nowSec - startSec) / (endSec - startSec)) * 100;
            label = `${formatTime(remainingSeconds)} restantes`;
            found = true;

            triggerAlert(`start-${i}`, [500, 200, 500]);
            if (remainingSeconds <= 300) triggerAlert(`warn-${i}`, [200, 100, 200, 100, 200, 100, 200]);
            if (remainingSeconds <= 60) triggerAlert(`urgent-${i}`, [500, 200, 500, 200, 500]);
            break;
          }
        }

        if (!found) {
          if (nowSec >= timeToSeconds(CHALLENGES[CHALLENGES.length - 1].end_time)) {
            idx = CHALLENGES.length - 1;
            status = "completed";
            label = "Journée terminée !";
            progressPercent = 100;
          } else {
            idx = 0;
            status = "upcoming";
            remainingSeconds = timeToSeconds(CHALLENGES[0].start_time) - nowSec;
            label = `Début dans ${formatTime(remainingSeconds)}`;
          }
        }
      }

      setState({ currentChallengeIndex: idx, status, remainingSeconds, progressPercent, label, isEventDay: eventDay, daysUntilEvent: days });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [manualOverride, triggerAlert]);

  return {
    ...state,
    challenge: CHALLENGES[state.currentChallengeIndex],
    isManualOverride: manualOverride !== null,
    goNext,
    goPrev,
    goToChallenge,
    resetToAuto,
    completedCount: getCompletedCount(state.currentChallengeIndex, state.status),
  };
}

function getCompletedCount(currentIndex: number, status: ChallengeStatusType): number {
  if (status === "completed") return currentIndex + 1;
  return currentIndex;
}

export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h${minutes.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
