"use client";

import { useRef, useState, useEffect } from "react";
import { usePhotos, usePhotoComments } from "@/hooks/useSupabase";
import type { Photo } from "@/types/database";
import { TEAMS } from "@/lib/teams";

interface Props {
  teamName: string;
}

const TEAM_NAMES = TEAMS.map((t) => t.name);

export function GalleryScreen({ teamName }: Props) {
  const { photos, loading, uploading, uploadPhoto } = usePhotos();
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // Upload flow: file picked → show preview with caption input
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const filtered = filter ? photos.filter((p) => p.team_name === filter) : photos;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setCaption("");
    e.target.value = "";
  };

  const confirmUpload = () => {
    if (!pendingFile) return;
    uploadPhoto(pendingFile, teamName, caption.trim() || undefined);
    setPendingFile(null);
    setPendingPreview(null);
    setCaption("");
  };

  const cancelUpload = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setCaption("");
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (pendingPreview) URL.revokeObjectURL(pendingPreview); };
  }, [pendingPreview]);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold text-[#1A1035]">Galerie Photos</h1>
        <p className="text-[11px] text-[#7C6FA0] mt-0.5">Photos partagees entre toutes les equipes</p>
      </div>

      {/* Take photo button */}
      <button onClick={() => fileRef.current?.click()} disabled={uploading || !!pendingFile}
        className="w-full h-14 rounded-2xl bg-[#7A4AED] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7A4AED]/25 active:scale-[0.98] transition-transform disabled:opacity-50">
        {uploading ? (
          <span className="animate-pulse">Envoi en cours...</span>
        ) : (
          "Prendre une photo"
        )}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {/* Upload preview + caption */}
      {pendingFile && pendingPreview && (
        <div className="rounded-2xl border border-[#E8E2F4] bg-white p-4 shadow-sm space-y-3 animate-slide-up">
          <img src={pendingPreview} alt="Preview" className="w-full max-h-[200px] object-contain rounded-xl bg-[#F3F0FA]" />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ajouter une legende (optionnel)..."
            className="w-full h-10 px-3 bg-[#F3F0FA] rounded-xl text-sm text-[#1A1035] placeholder:text-[#7C6FA0]/40 focus:outline-none focus:ring-1 focus:ring-[#7A4AED]/30"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={cancelUpload}
              className="flex-1 h-10 rounded-xl border border-[#E8E2F4] text-sm font-semibold text-[#7C6FA0] active:scale-95 transition-transform">
              Annuler
            </button>
            <button onClick={confirmUpload}
              className="flex-1 h-10 rounded-xl bg-[#7A4AED] text-white text-sm font-semibold active:scale-95 transition-transform shadow-sm shadow-[#7A4AED]/20">
              Publier
            </button>
          </div>
        </div>
      )}

      {/* Team filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        <button onClick={() => setFilter(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
            filter === null ? "bg-[#7A4AED] text-white" : "bg-[#F3F0FA] text-[#7C6FA0]"
          }`}>
          Toutes
        </button>
        {TEAM_NAMES.map((name) => (
          <button key={name} onClick={() => setFilter(filter === name ? null : name)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
              filter === name ? "bg-[#7A4AED] text-white" : "bg-[#F3F0FA] text-[#7C6FA0]"
            }`}>
            {name}
          </button>
        ))}
      </div>

      {/* Photo count */}
      {!loading && (
        <p className="text-[10px] text-[#7C6FA0] text-center">
          {filtered.length} photo{filtered.length !== 1 ? "s" : ""} · mise a jour auto
        </p>
      )}

      {/* Mosaic */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-sm text-[#7C6FA0] animate-pulse">Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-4xl">📸</p>
          <p className="text-sm text-[#7C6FA0]">Aucune photo pour l'instant</p>
          <p className="text-xs text-[#7C6FA0]/60">Soyez le premier a capturer un moment !</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((photo) => (
            <button key={photo.id} onClick={() => setViewPhoto(photo)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#F3F0FA] text-left">
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                {photo.team_name && (
                  <p className="text-[9px] text-white font-semibold truncate">{photo.team_name}</p>
                )}
                {photo.caption && (
                  <p className="text-[8px] text-white/70 truncate">{photo.caption}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox with comments */}
      {viewPhoto && (
        <PhotoLightbox photo={viewPhoto} teamName={teamName} onClose={() => setViewPhoto(null)} />
      )}
    </div>
  );
}

function PhotoLightbox({ photo, teamName, onClose }: { photo: Photo; teamName: string; onClose: () => void }) {
  const { comments, addComment } = usePhotoComments(photo.id);
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    addComment(input.trim(), teamName);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={onClose}>
      {/* Close button */}
      <button onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 text-white text-xl font-bold flex items-center justify-center">
        ✕
      </button>

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center p-4" onClick={onClose}>
        <img src={photo.url} alt="" className="max-w-full max-h-[55vh] object-contain rounded-lg" />
      </div>

      {/* Caption + team */}
      <div className="text-center -mt-2 mb-2 px-4">
        {photo.team_name && (
          <p className="text-xs text-white/50">{photo.team_name}</p>
        )}
        {photo.caption && (
          <p className="text-sm text-white/90 mt-1 italic">{photo.caption}</p>
        )}
      </div>

      {/* Comments section */}
      <div className="px-4 pb-4 space-y-2" onClick={(e) => e.stopPropagation()}>
        {/* Existing comments */}
        {comments.length > 0 && (
          <div className="max-h-[100px] overflow-y-auto space-y-1.5 mb-1">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-[#7A4AED] shrink-0 mt-px">{c.team_name}</span>
                <span className="text-xs text-white/80 leading-snug">{c.content}</span>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Commenter en tant que votre equipe..."
            className="flex-1 h-10 px-3 bg-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#7A4AED]/50"
          />
          <button onClick={handleSubmit} disabled={!input.trim()}
            className="h-10 px-4 bg-[#7A4AED] text-white rounded-xl text-xs font-semibold disabled:opacity-30 active:scale-95 transition-transform">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
