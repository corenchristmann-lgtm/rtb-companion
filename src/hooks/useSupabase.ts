"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { ChecklistItem, Note } from "@/types/database";
import { DEFAULT_CHECKLIST } from "@/lib/data";

// ---- Checklist ----
export function useChecklist(challengeId: number) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("id");
    if (data) setItems(data as ChecklistItem[]);
    setLoading(false);
  }, [challengeId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleItem = useCallback(async (itemId: number, checked: boolean) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, is_checked: checked } : i));
    await supabase.from("checklist_items").update({ is_checked: checked }).eq("id", itemId);
  }, []);

  const addItem = useCallback(async (label: string) => {
    const { data } = await supabase
      .from("checklist_items")
      .insert({ challenge_id: challengeId, label, is_custom: true, is_checked: false })
      .select()
      .single();
    if (data) setItems(prev => [...prev, data as ChecklistItem]);
  }, [challengeId]);

  const checkedCount = items.filter(i => i.is_checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return { items, loading, toggleItem, addItem, checkedCount, totalCount, progress };
}

// ---- Notes ----
export function useNotes(projectId?: number, challengeId?: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchNotes = useCallback(async () => {
    let query = supabase.from("notes").select("*");
    if (projectId) query = query.eq("project_id", projectId);
    if (challengeId) query = query.eq("challenge_id", challengeId);
    const { data } = await query.order("id");
    if (data) setNotes(data as Note[]);
    setLoading(false);
  }, [projectId, challengeId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const upsertNote = useCallback(async (
    pId: number,
    cId: number,
    updates: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>
  ) => {
    // Optimistic update
    setNotes(prev => {
      const existing = prev.find(n => n.project_id === pId && n.challenge_id === cId);
      if (existing) {
        return prev.map(n =>
          n.project_id === pId && n.challenge_id === cId
            ? { ...n, ...updates, updated_at: new Date().toISOString() }
            : n
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          project_id: pId,
          challenge_id: cId,
          score: null,
          free_notes: null,
          strength: null,
          improvement: null,
          ...updates,
          updated_at: new Date().toISOString(),
        },
      ];
    });

    // Debounced save
    const key = `${pId}-${cId}`;
    if (debounceRef.current[key]) clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = setTimeout(async () => {
      await supabase.from("notes").upsert(
        {
          project_id: pId,
          challenge_id: cId,
          ...updates,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "project_id,challenge_id" }
      );
    }, 500);
  }, []);

  return { notes, loading, upsertNote };
}

// ---- All checklist progress (for dashboard) ----
export function useAllChecklistProgress() {
  const [progress, setProgress] = useState<Record<number, { checked: number; total: number }>>({});

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("checklist_items").select("challenge_id, is_checked");
      if (!data) return;
      const map: Record<number, { checked: number; total: number }> = {};
      for (const item of data as { challenge_id: number; is_checked: boolean }[]) {
        if (!map[item.challenge_id]) map[item.challenge_id] = { checked: 0, total: 0 };
        map[item.challenge_id].total++;
        if (item.is_checked) map[item.challenge_id].checked++;
      }
      setProgress(map);
    }
    fetch();
  }, []);

  return progress;
}

// ---- Initialize checklist items if empty ----
export async function initializeChecklistIfEmpty() {
  const { data, error } = await supabase.from("checklist_items").select("id").limit(1);
  if (error || (data && data.length > 0)) return;

  const items: { challenge_id: number; label: string; is_checked: boolean; is_custom: boolean }[] = [];
  for (const [challengeId, labels] of Object.entries(DEFAULT_CHECKLIST)) {
    for (const label of labels) {
      items.push({
        challenge_id: parseInt(challengeId),
        label,
        is_checked: false,
        is_custom: false,
      });
    }
  }
  await supabase.from("checklist_items").insert(items);
}
