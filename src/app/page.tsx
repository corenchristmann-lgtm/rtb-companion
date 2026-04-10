"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { NowScreen } from "@/components/NowScreen";
import { PlanningScreen } from "@/components/PlanningScreen";
import { ScoreScreen } from "@/components/ScoreScreen";
import { ProjectsScreen } from "@/components/ProjectsScreen";
import { BottomNav } from "@/components/BottomNav";
import { TeamSelector } from "@/components/TeamSelector";
import { useTeam, teamChallenges } from "@/hooks/useTeam";
import { useTimer } from "@/hooks/useTimer";
import { useNotes, initializeChecklistIfEmpty } from "@/hooks/useSupabase";

export type Tab = "now" | "planning" | "score" | "projects";
const TAB_ORDER: Tab[] = ["now", "planning", "score", "projects"];

export default function Home() {
  const { team, loaded, selectTeam, logout } = useTeam();
  const [tab, setTab] = useState<Tab>("now");
  const [focusChallengeId, setFocusChallengeId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | "none">("none");

  const challenges = useMemo(() => team ? teamChallenges(team) : [], [team]);
  const timer = useTimer(challenges);
  const { notes } = useNotes();

  useEffect(() => { initializeChecklistIfEmpty(); }, []);

  // Badge: count past challenges with no scores
  const unscoredCount = useMemo(() => {
    if (!team) return 0;
    let count = 0;
    for (let i = 0; i < timer.completedCount; i++) {
      const ch = challenges[i];
      if (!ch) continue;
      const hasAnyScore = team.projects.some(p =>
        notes.some(n => n.project_id === p.db_id && n.challenge_id === ch.id && n.score)
      );
      if (!hasAnyScore) count++;
    }
    return count;
  }, [timer.completedCount, challenges, notes, team]);

  // Tab change with direction for animation
  const changeTab = (t: Tab) => {
    const fromIdx = TAB_ORDER.indexOf(tab);
    const toIdx = TAB_ORDER.indexOf(t);
    setDirection(toIdx > fromIdx ? "left" : toIdx < fromIdx ? "right" : "none");
    setTab(t);
    if (t !== "planning") setFocusChallengeId(null);
  };

  if (!loaded) return null;
  if (!team) return <TeamSelector onSelect={selectTeam} />;

  const openChallenge = (id: number) => { setFocusChallengeId(id); changeTab("planning"); };

  return (
    <div className="flex flex-col h-dvh">
      <main className="flex-1 overflow-y-auto pb-[68px]">
        <div key={tab} className={direction === "left" ? "animate-slide-left" : direction === "right" ? "animate-slide-right" : "animate-fade-in"}>
          {tab === "now" && <NowScreen timer={timer} challenges={challenges} team={team} onOpenChallenge={openChallenge} onLogout={logout} />}
          {tab === "planning" && <PlanningScreen timer={timer} challenges={challenges} focusId={focusChallengeId} onClearFocus={() => setFocusChallengeId(null)} />}
          {tab === "score" && <ScoreScreen timer={timer} challenges={challenges} projects={team.projects} />}
          {tab === "projects" && <ProjectsScreen challenges={challenges} projects={team.projects} team={team} />}
        </div>
      </main>
      <BottomNav active={tab} onChange={changeTab} unscoredBadge={unscoredCount} />
    </div>
  );
}
