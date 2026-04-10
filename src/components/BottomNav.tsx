"use client";

import type { Tab } from "@/app/page";

const items: { id: Tab; label: string; icon: string }[] = [
  { id: "now", label: "Maintenant", icon: "⏱" },
  { id: "planning", label: "Planning", icon: "📍" },
  { id: "score", label: "Noter", icon: "⭐" },
  { id: "projects", label: "Projets", icon: "👥" },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-0.5 py-2 min-h-[52px] transition-colors ${
              active === item.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="text-[17px] leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
