"use client";

import { useState } from "react";
import { useChecklist } from "@/hooks/useSupabase";

export function ChecklistTab({ challengeId }: { challengeId: number }) {
  const { items, loading, toggleItem, addItem, progress, checkedCount, totalCount } = useChecklist(challengeId);
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    addItem(label);
    setNewLabel("");
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground text-sm">Chargement...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progression</span>
          <span className="text-sm text-primary font-semibold">
            {checkedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id, !item.is_checked)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] ${
              item.is_checked ? "opacity-60" : "bg-card border border-border"
            }`}
          >
            <div
              className={`w-5 h-5 mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                item.is_checked
                  ? "bg-green-500 border-green-500"
                  : "border-muted-foreground"
              }`}
            >
              {item.is_checked && (
                <span className="text-xs text-white font-bold">\u2713</span>
              )}
            </div>
            <span className={`text-sm ${item.is_checked ? "line-through text-muted-foreground" : ""}`}>
              {item.label}
              {item.is_custom && (
                <span className="ml-1.5 text-[10px] text-primary">(custom)</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Add custom */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Ajouter un item..."
          className="flex-1 h-11 px-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleAdd}
          disabled={!newLabel.trim()}
          className="h-11 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-40 active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
