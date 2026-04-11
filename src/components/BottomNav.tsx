"use client";

import type { Tab } from "@/app/page";

const items: { id: Tab; label: string; icon: string }[] = [
  { id: "board", label: "Board", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "map", label: "Maps", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { id: "gallery", label: "Galerie", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[#E8E2F4]/80 bg-white/90 backdrop-blur-2xl">
      <div role="tablist" className="flex justify-around max-w-lg mx-auto px-4 py-2.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              role="tab"
              aria-selected={isActive}
              className="flex flex-col items-center gap-0.5 px-5 py-1.5 min-h-[44px] rounded-xl pressable">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={isActive ? "2.2" : "1.8"}
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
                className="transition-[color,stroke-width] duration-200 ease-custom"
                style={{ color: isActive ? "#7A4AED" : "#6B5E8A" }}>
                <path d={item.icon} />
              </svg>
              <span
                className="text-[10px] font-semibold transition-colors duration-200 ease-custom"
                style={{ color: isActive ? "#7A4AED" : "#6B5E8A" }}>
                {item.label}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#7A4AED] -mt-0.5 transition-[opacity,transform] duration-200"
                aria-hidden="true"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "scale(1)" : "scale(0)",
                  transitionTimingFunction: "var(--ease-spring)",
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
