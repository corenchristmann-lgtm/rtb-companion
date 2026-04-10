"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import type { ChecklistItem, Note, Photo, PhotoComment } from "@/types/database";
import { DEFAULT_CHECKLIST } from "@/lib/teams";

// ── Offline helpers ──
function lsGet<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Checklist ──
export function useChecklist(challengeId: number) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lsKey = `rtb-checklist-${challengeId}`;

  const fetchItems = useCallback(async () => {
    // Try Supabase first, fallback to localStorage
    try {
      const { data } = await getSupabase().from("checklist_items").select("*").eq("challenge_id", challengeId).order("id");
      if (data && data.length > 0) {
        setItems(data as ChecklistItem[]);
        lsSet(lsKey, data);
        setLoading(false);
        return;
      }
    } catch {}
    // Fallback
    setItems(lsGet(lsKey, []));
    setLoading(false);
  }, [challengeId, lsKey]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggleItem = useCallback(async (itemId: number, checked: boolean) => {
    setItems(prev => {
      const next = prev.map(i => i.id === itemId ? { ...i, is_checked: checked } : i);
      lsSet(`rtb-checklist-${prev[0]?.challenge_id ?? 0}`, next);
      return next;
    });
    try { await getSupabase().from("checklist_items").update({ is_checked: checked }).eq("id", itemId); } catch {}
  }, []);

  const addItem = useCallback(async (label: string) => {
    try {
      const { data } = await getSupabase().from("checklist_items").insert({ challenge_id: challengeId, label, is_custom: true, is_checked: false }).select().single();
      if (data) setItems(prev => { const next = [...prev, data as ChecklistItem]; lsSet(lsKey, next); return next; });
    } catch {
      const fake: ChecklistItem = { id: Date.now(), challenge_id: challengeId, label, is_checked: false, is_custom: true, created_at: new Date().toISOString() };
      setItems(prev => { const next = [...prev, fake]; lsSet(lsKey, next); return next; });
    }
  }, [challengeId, lsKey]);

  return { items, loading, toggleItem, addItem, checkedCount: items.filter(i => i.is_checked).length, totalCount: items.length, progress: items.length > 0 ? (items.filter(i => i.is_checked).length / items.length) * 100 : 0 };
}

// ── Notes (with offline) ──
export function useNotes(projectId?: number, challengeId?: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lsKey = "rtb-notes";

  const fetchNotes = useCallback(async () => {
    try {
      let query = getSupabase().from("notes").select("*");
      if (projectId) query = query.eq("project_id", projectId);
      if (challengeId) query = query.eq("challenge_id", challengeId);
      const { data } = await query.order("id");
      if (data) { setNotes(data as Note[]); lsSet(lsKey, data); setLoading(false); return; }
    } catch {}
    setNotes(lsGet(lsKey, []));
    setLoading(false);
  }, [projectId, challengeId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const upsertNote = useCallback(async (
    pId: number, cId: number,
    updates: Partial<Pick<Note, "score" | "free_notes" | "strength" | "improvement">>
  ) => {
    setNotes(prev => {
      const existing = prev.find(n => n.project_id === pId && n.challenge_id === cId);
      const next = existing
        ? prev.map(n => n.project_id === pId && n.challenge_id === cId ? { ...n, ...updates, updated_at: new Date().toISOString() } : n)
        : [...prev, { id: Date.now(), project_id: pId, challenge_id: cId, score: null, free_notes: null, strength: null, improvement: null, ...updates, updated_at: new Date().toISOString() }];
      lsSet(lsKey, next);
      return next;
    });
    const key = `${pId}-${cId}`;
    if (debounceRef.current[key]) clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = setTimeout(async () => {
      try {
        await getSupabase().from("notes").upsert({ project_id: pId, challenge_id: cId, ...updates, updated_at: new Date().toISOString() }, { onConflict: "project_id,challenge_id" });
      } catch {}
    }, 500);
  }, []);

  return { notes, loading, upsertNote };
}

// ── All notes (for badge/cross-team) ──
export function useAllNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await getSupabase().from("notes").select("*").order("id");
        if (data) { setNotes(data as Note[]); lsSet("rtb-all-notes", data); return; }
      } catch {}
      setNotes(lsGet("rtb-all-notes", []));
    }
    fetch();
    const interval = setInterval(fetch, 30000); // refresh every 30s for cross-team
    return () => clearInterval(interval);
  }, []);
  return notes;
}

// ── Photos (shared gallery) ──
export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const { data } = await getSupabase().from("photos").select("*").order("created_at", { ascending: false });
      if (data) { setPhotos(data as Photo[]); lsSet("rtb-photos", data); setLoading(false); return; }
    } catch {}
    setPhotos(lsGet("rtb-photos", []));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 15000);
    return () => clearInterval(interval);
  }, [fetchPhotos]);

  const uploadPhoto = useCallback(async (file: File, teamName: string) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadErr } = await getSupabase().storage.from("photos").upload(path, file, { contentType: file.type });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = getSupabase().storage.from("photos").getPublicUrl(path);
      const url = urlData.publicUrl;
      const { data } = await getSupabase().from("photos").insert({ url, team_name: teamName }).select().single();
      if (data) setPhotos(prev => [data as Photo, ...prev]);
    } catch (err) {
      console.error("Photo upload failed:", err);
    }
    setUploading(false);
  }, []);

  return { photos, loading, uploading, uploadPhoto, refresh: fetchPhotos };
}

// ── Photo comments ──
export function usePhotoComments(photoId: number) {
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const lsKey = `rtb-photo-comments-${photoId}`;

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await getSupabase().from("photo_comments").select("*").eq("photo_id", photoId).order("created_at", { ascending: true });
      if (data) { setComments(data as PhotoComment[]); lsSet(lsKey, data); return; }
    } catch {}
    setComments(lsGet(lsKey, []));
  }, [photoId, lsKey]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = useCallback(async (content: string, teamName: string) => {
    const optimistic: PhotoComment = { id: Date.now(), photo_id: photoId, content, team_name: teamName, created_at: new Date().toISOString() };
    setComments(prev => [...prev, optimistic]);
    try {
      const { data } = await getSupabase().from("photo_comments").insert({ photo_id: photoId, content, team_name: teamName }).select().single();
      if (data) setComments(prev => prev.map(c => c.id === optimistic.id ? (data as PhotoComment) : c));
    } catch {}
  }, [photoId]);

  return { comments, addComment };
}

// ── Init checklist ──
const ATELIER_DB_ID: Record<string, number> = { bnp: 1, ucm: 2, we: 3, loterie: 4, evs: 5, defenso: 6, akt: 7, vedia: 8 };

export async function initializeChecklistIfEmpty() {
  try {
    const { data, error } = await getSupabase().from("checklist_items").select("id").limit(1);
    if (error || (data && data.length > 0)) return;
    const items: { challenge_id: number; label: string; is_checked: boolean; is_custom: boolean }[] = [];
    for (const [atelierId, labels] of Object.entries(DEFAULT_CHECKLIST)) {
      const dbId = ATELIER_DB_ID[atelierId];
      if (!dbId) continue;
      for (const label of labels) items.push({ challenge_id: dbId, label, is_checked: false, is_custom: false });
    }
    await getSupabase().from("checklist_items").insert(items);
  } catch {}
}
