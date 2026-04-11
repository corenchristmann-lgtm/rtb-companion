"use client";

import { useState, useMemo } from "react";
import { BoardScreen } from "@/components/BoardScreen";
import { MapScreen } from "@/components/MapScreen";
import { GalleryScreen } from "@/components/GalleryScreen";
import { BottomNav } from "@/components/BottomNav";
import { TeamSelector } from "@/components/TeamSelector";
import { useTeam, teamChallenges } from "@/hooks/useTeam";
import { useTimer } from "@/hooks/useTimer";

export type Tab = "board" | "map" | "gallery";

export default function Home() {
  const { team, loaded, selectTeam, logout } = useTeam();
  const [tab, setTab] = useState<Tab>("board");

  const challenges = useMemo(() => team ? teamChallenges(team) : [], [team]);
  const timer = useTimer(challenges);

  if (!loaded) return (
    <div className="flex flex-col items-center justify-center h-dvh bg-gradient-to-b from-[#F3F0FA] via-[#FFF5F7] to-white">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-primary/10 flex items-center justify-center animate-breathe">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7A4AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <p className="mt-4 text-sm font-semibold text-muted-foreground animate-pulse">Chargement...</p>
    </div>
  );
  if (!team) return <TeamSelector onSelect={selectTeam} />;

  return (
    <div className="flex flex-col h-dvh">
      <main className={`flex-1 ${tab === "map" ? "" : "overflow-y-auto"} pb-[68px]`}>
        {tab === "board" && (
          <BoardScreen timer={timer} challenges={challenges} team={team} onLogout={logout} />
        )}
        {tab === "map" && (
          <MapScreen currentTeamId={team.id} />
        )}
        {tab === "gallery" && (
          <GalleryScreen teamName={team.name} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
