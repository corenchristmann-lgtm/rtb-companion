"use client";

import type { Tab } from "@/app/page";

const items: { id: Tab; label: string }[] = [
  { id: "now", label: "Maintenant" },
  { id: "planning", label: "Planning" },
  { id: "score", label: "Noter" },
  { id: "projects", label: "Projets" },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[#E8E2F4] bg-white/95 backdrop-blur-xl">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => (
          <button key={item.id} onClick={() => onChange(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-3 min-h-[52px] transition-colors ${
              active === item.id ? "text-[#7A4AED]" : "text-[#7C6FA0]"
            }`}>
            <span className="text-[11px] font-semibold">{item.label}</span>
            {active === item.id && <div className="w-1 h-1 rounded-full bg-[#7A4AED]" />}
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
