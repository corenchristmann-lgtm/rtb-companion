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
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[#2E2B45] bg-[#0F0E17]/95 backdrop-blur-xl">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-0.5 py-2 min-h-[52px] transition-colors ${
              active === item.id ? "text-[#7A4AED]" : "text-muted-foreground"
            }`}
          >
            <span className="text-[17px] leading-none">{item.icon}</span>
            <span className={`text-[10px] font-semibold ${active === item.id ? "text-[#7A4AED]" : ""}`}>
              {item.label}
            </span>
            {active === item.id && (
              <div className="w-1 h-1 rounded-full bg-[#7A4AED] mt-0.5" />
            )}
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
