"use client";

import type { Tab } from "@/app/page";

const items: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Accueil", icon: "⏱" },
  { id: "challenges", label: "Défis", icon: "📋" },
  { id: "notes", label: "Notes", icon: "✏️" },
  { id: "team", label: "Équipe", icon: "👥" },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
