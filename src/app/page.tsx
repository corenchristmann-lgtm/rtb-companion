"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { ChallengesList } from "@/components/ChallengesList";
import { NotesPage } from "@/components/NotesPage";
import { TeamPage } from "@/components/TeamPage";
import { BottomNav } from "@/components/BottomNav";
import { useTimer } from "@/hooks/useTimer";
import { initializeChecklistIfEmpty } from "@/hooks/useSupabase";

export type Tab = "home" | "challenges" | "notes" | "team";

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const timer = useTimer();

  useEffect(() => {
    initializeChecklistIfEmpty();
  }, []);

  const openChallenge = (id: number) => {
    setSelectedChallengeId(id);
    setTab("challenges");
  };

  return (
    <div className="flex flex-col h-dvh">
      <main className="flex-1 overflow-y-auto pb-[72px]">
        {tab === "home" && (
          <Dashboard timer={timer} onOpenChallenge={openChallenge} />
        )}
        {tab === "challenges" && (
          <ChallengesList
            timer={timer}
            selectedId={selectedChallengeId}
            onSelect={setSelectedChallengeId}
          />
        )}
        {tab === "notes" && <NotesPage />}
        {tab === "team" && <TeamPage />}
      </main>
      <BottomNav active={tab} onChange={(t) => {
        setTab(t);
        if (t !== "challenges") setSelectedChallengeId(null);
      }} />
    </div>
  );
}
