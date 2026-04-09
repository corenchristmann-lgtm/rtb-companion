"use client";

import { useState } from "react";
import { useChecklist } from "@/hooks/useSupabase";

export function ChecklistTab({ challengeId }: { challengeId: number }) {
  const { items, loading, toggleItem, addItem, progress, checkedCount, totalCount } = useChecklist(challengeId);
  const [input, setInput] = useState("");

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-8">Chargement…</p>;
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progression</span>
          <span className="text-xs font-semibold text-primary tabular-nums">{checkedCount}/{totalCount}</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id, !item.is_checked)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            <div className={`w-[18px] h-[18px] mt-0.5 rounded border-[1.5px] shrink-0 flex items-center justify-center transition-colors ${
              item.is_checked ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/40"
            }`}>
              {item.is_checked && <span className="text-[10px] text-white">✓</span>}
            </div>
            <span className={`text-sm leading-snug ${item.is_checked ? "line-through text-muted-foreground/50" : ""}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Add */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              addItem(input.trim());
              setInput("");
            }
          }}
          placeholder="Ajouter un item…"
          className="flex-1 h-10 px-3 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={() => { if (input.trim()) { addItem(input.trim()); setInput(""); } }}
          disabled={!input.trim()}
          className="h-10 w-10 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-30 active:scale-90 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
