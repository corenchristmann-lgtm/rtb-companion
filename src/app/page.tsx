"use client";

import { useState, useMemo } from "react";
import { BoardScreen } from "@/components/BoardScreen";
import { GalleryScreen } from "@/components/GalleryScreen";
import { BottomNav } from "@/components/BottomNav";
import { TeamSelector } from "@/components/TeamSelector";
import { useTeam, teamChallenges } from "@/hooks/useTeam";
import { useTimer } from "@/hooks/useTimer";

export type Tab = "board" | "gallery";

export default function Home() {
  const { team, loaded, selectTeam, logout } = useTeam();
  const [tab, setTab] = useState<Tab>("board");

  const challenges = useMemo(() => team ? teamChallenges(team) : [], [team]);
  const timer = useTimer(challenges);

  if (!loaded) return null;
  if (!team) return <TeamSelector onSelect={selectTeam} />;

  return (
    <div className="flex flex-col h-dvh">
      <main className="flex-1 overflow-y-auto pb-[68px]">
        {tab === "board" && (
          <BoardScreen timer={timer} challenges={challenges} team={team} onLogout={logout} />
        )}
        {tab === "gallery" && (
          <GalleryScreen teamName={team.name} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
