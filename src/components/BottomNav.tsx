"use client";

import type { Tab } from "@/app/page";

const items: { id: Tab; label: string }[] = [
  { id: "now", label: "Maintenant" },
  { id: "planning", label: "Planning" },
  { id: "score", label: "Noter" },
  { id: "projects", label: "Projets" },
];

export function BottomNav({ active, onChange, unscoredBadge = 0 }: { active: Tab; onChange: (t: Tab) => void; unscoredBadge?: number }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[#E8E2F4] bg-white/95 backdrop-blur-xl">
      <div className="grid grid-cols-4 max-w-lg mx-auto px-2 py-1.5 gap-1.5">
        {items.map((item) => (
          <button key={item.id} onClick={() => onChange(item.id)}
            className={`relative flex items-center justify-center rounded-xl min-h-[48px] text-sm font-semibold transition-all ${
              active === item.id
                ? "bg-[#7A4AED] text-white shadow-sm shadow-[#7A4AED]/20"
                : "text-[#7C6FA0] active:bg-[#F3F0FA]"
            }`}>
            {item.label}
            {item.id === "score" && unscoredBadge > 0 && active !== "score" && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#F46277] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unscoredBadge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
