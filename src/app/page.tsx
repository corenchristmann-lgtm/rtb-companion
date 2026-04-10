"use client";

import { useState, useEffect } from "react";
import { NowScreen } from "@/components/NowScreen";
import { PlanningScreen } from "@/components/PlanningScreen";
import { ScoreScreen } from "@/components/ScoreScreen";
import { ProjectsScreen } from "@/components/ProjectsScreen";
import { BottomNav } from "@/components/BottomNav";
import { useTimer } from "@/hooks/useTimer";
import { initializeChecklistIfEmpty } from "@/hooks/useSupabase";

export type Tab = "now" | "planning" | "score" | "projects";

export default function Home() {
  const [tab, setTab] = useState<Tab>("now");
  const [focusChallengeId, setFocusChallengeId] = useState<number | null>(null);
  const timer = useTimer();

  useEffect(() => { initializeChecklistIfEmpty(); }, []);

  const openChallenge = (id: number) => {
    setFocusChallengeId(id);
    setTab("planning");
  };

  return (
    <div className="flex flex-col h-dvh">
      <main className="flex-1 overflow-y-auto pb-[68px]">
        {tab === "now" && <NowScreen timer={timer} onOpenChallenge={openChallenge} />}
        {tab === "planning" && (
          <PlanningScreen
            timer={timer}
            focusId={focusChallengeId}
            onClearFocus={() => setFocusChallengeId(null)}
          />
        )}
        {tab === "score" && <ScoreScreen timer={timer} />}
        {tab === "projects" && <ProjectsScreen />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
