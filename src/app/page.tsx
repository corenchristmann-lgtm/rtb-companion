"use client";

import { useState, useEffect, useMemo } from "react";
import { NowScreen } from "@/components/NowScreen";
import { PlanningScreen } from "@/components/PlanningScreen";
import { ScoreScreen } from "@/components/ScoreScreen";
import { ProjectsScreen } from "@/components/ProjectsScreen";
import { BottomNav } from "@/components/BottomNav";
import { TeamSelector } from "@/components/TeamSelector";
import { useTeam, teamChallenges } from "@/hooks/useTeam";
import { useTimer } from "@/hooks/useTimer";
import { initializeChecklistIfEmpty } from "@/hooks/useSupabase";

export type Tab = "now" | "planning" | "score" | "projects";

export default function Home() {
  const { team, loaded, selectTeam, logout } = useTeam();
  const [tab, setTab] = useState<Tab>("now");
  const [focusChallengeId, setFocusChallengeId] = useState<number | null>(null);

  const challenges = useMemo(() => team ? teamChallenges(team) : [], [team]);
  const timer = useTimer(challenges);

  useEffect(() => { initializeChecklistIfEmpty(); }, []);

  if (!loaded) return null;
  if (!team) return <TeamSelector onSelect={selectTeam} />;

  const openChallenge = (id: number) => { setFocusChallengeId(id); setTab("planning"); };

  return (
    <div className="flex flex-col h-dvh">
      <main className="flex-1 overflow-y-auto pb-[68px]">
        {tab === "now" && <NowScreen timer={timer} challenges={challenges} team={team} onOpenChallenge={openChallenge} onLogout={logout} />}
        {tab === "planning" && <PlanningScreen timer={timer} challenges={challenges} focusId={focusChallengeId} onClearFocus={() => setFocusChallengeId(null)} />}
        {tab === "score" && <ScoreScreen timer={timer} challenges={challenges} projects={team.projects} />}
        {tab === "projects" && <ProjectsScreen challenges={challenges} projects={team.projects} team={team} />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
