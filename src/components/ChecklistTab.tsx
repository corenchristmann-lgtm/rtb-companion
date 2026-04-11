"use client";

import { useState } from "react";
import { useChecklist } from "@/hooks/useSupabase";

export function ChecklistTab({ challengeId }: { challengeId: number }) {
  const { items, loading, toggleItem, addItem, progress, checkedCount, totalCount } = useChecklist(challengeId);
  const [input, setInput] = useState("");

  if (loading) return <p className="text-sm text-muted-foreground text-center py-8">Chargement…</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#F3F0FA] rounded-full overflow-hidden">
          <div className="h-full bg-[#7A4AED] rounded-full transition-[width] duration-300 ease-custom" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[11px] font-bold text-[#7A4AED] tabular-nums shrink-0">{checkedCount}/{totalCount}</span>
      </div>

      <div className="space-y-0.5">
        {items.map((item) => (
          <button key={item.id} onClick={() => toggleItem(item.id, !item.is_checked)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left pressable">
            <div className={`w-[20px] h-[20px] mt-px rounded-md border-2 shrink-0 flex items-center justify-center transition-[background-color,border-color] duration-200 ${
              item.is_checked ? "bg-emerald-500 border-emerald-500" : "border-[#E8E2F4]"
            }`}>
              {item.is_checked && <span className="text-[10px] text-white font-bold">✓</span>}
            </div>
            <span className={`text-[13px] leading-snug ${item.is_checked ? "line-through text-[#7C6FA0]/40" : "text-[#1A1035]/80"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { addItem(input.trim()); setInput(""); } }}
          placeholder="Ajouter…"
          className="flex-1 h-10 px-3 bg-[#F3F0FA] rounded-xl text-sm placeholder:text-[#7C6FA0]/40 focus:outline-none focus:ring-1 focus:ring-[#7A4AED]/30" />
        <button onClick={() => { if (input.trim()) { addItem(input.trim()); setInput(""); } }}
          disabled={!input.trim()}
          aria-label="Ajouter un element"
          className="h-11 w-11 bg-[#7A4AED] text-white rounded-xl font-bold disabled:opacity-25 pressable">
          +
        </button>
      </div>
    </div>
  );
}
