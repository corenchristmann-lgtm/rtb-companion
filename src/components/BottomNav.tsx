"use client";

type Tab = "dashboard" | "challenges" | "notes" | "team";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "\u{1F3E0}" },
  { id: "challenges", label: "Challenges", icon: "\u{1F3C6}" },
  { id: "notes", label: "Notes", icon: "\u{1F4DD}" },
  { id: "team", label: "\u00c9quipe", icon: "\u{1F465}" },
];

export function BottomNav({
  active,
  onTabChange,
}: {
  active: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[oklch(0.11_0.015_280)] border-t border-border backdrop-blur-xl">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] rounded-xl transition-all ${
              active === t.id
                ? "text-primary scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        ))}
      </div>
      {/* Safe area for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
