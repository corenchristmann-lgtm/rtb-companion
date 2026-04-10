"use client";

import { useRef, useState } from "react";
import { usePhotos } from "@/hooks/useSupabase";
import type { Photo } from "@/types/database";

interface Props {
  teamName: string;
  onBack: () => void;
}

export function GalleryScreen({ teamName, onBack }: Props) {
  const { photos, loading, uploading, uploadPhoto } = usePhotos();
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPhoto(file, teamName);
    e.target.value = "";
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs text-[#7A4AED] font-semibold">
          ← Projets
        </button>
        <h1 className="text-lg font-bold text-[#1A1035]">Galerie</h1>
        <div className="w-14" />
      </div>
      <p className="text-[11px] text-[#7C6FA0] text-center -mt-2">Photos partagées entre toutes les équipes</p>

      {/* Take photo button */}
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full h-14 rounded-2xl bg-[#7A4AED] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7A4AED]/25 active:scale-[0.98] transition-transform disabled:opacity-50">
        {uploading ? (
          <span className="animate-pulse">Envoi en cours...</span>
        ) : (
          <>📷 Prendre une photo</>
        )}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      {/* Photo count */}
      {!loading && (
        <p className="text-[10px] text-[#7C6FA0] text-center">
          {photos.length} photo{photos.length !== 1 ? "s" : ""} · mise à jour auto
        </p>
      )}

      {/* Mosaic */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-sm text-[#7C6FA0] animate-pulse">Chargement...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-4xl">📸</p>
          <p className="text-sm text-[#7C6FA0]">Aucune photo pour l'instant</p>
          <p className="text-xs text-[#7C6FA0]/60">Soyez le premier à capturer un moment !</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => (
            <button key={photo.id} onClick={() => setViewPhoto(photo)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#F3F0FA]">
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              {photo.team_name && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                  <p className="text-[9px] text-white font-semibold truncate">{photo.team_name}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={() => setViewPhoto(null)}>
          <button onClick={() => setViewPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white text-xl font-bold flex items-center justify-center">
            ✕
          </button>
          <img src={viewPhoto.url} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
          {viewPhoto.team_name && (
            <p className="text-sm text-white/80 mt-3">{viewPhoto.team_name}</p>
          )}
        </div>
      )}
    </div>
  );
}
