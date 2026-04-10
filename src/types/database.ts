export interface Challenge {
  id: number;
  position: number;
  company: string;
  emoji: string | null;
  start_time: string; // TIME as string "HH:MM"
  end_time: string;
  location: string;
  address: string;
  challenge_description: string;
  format: string;
  skills: string[];
  tips: string[];
  briefing_notes: string | null;
  jury: string[];
  contact_name: string | null;
  contact_phone: string | null;
  prize: string;
  transport_to_next: string | null;
  directions_url: string | null;
}

export interface Project {
  id: number;
  name: string;
  members: string;
  description: string;
}

export interface ChecklistItem {
  id: number;
  challenge_id: number;
  label: string;
  is_checked: boolean;
  is_custom: boolean;
  created_at: string;
}

export interface Note {
  id: number;
  project_id: number;
  challenge_id: number;
  score: number | null;
  free_notes: string | null;
  strength: string | null;
  improvement: string | null;
  updated_at: string;
}

export interface Photo {
  id: number;
  url: string;
  caption: string | null;
  team_name: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface PhotoReaction {
  id: number;
  photo_id: number;
  emoji: string;
  team_name: string;
  created_at: string;
}

export type ChallengeStatusType = "upcoming" | "in_transit" | "active" | "completed";

export interface ChallengeStatus {
  id: number;
  challenge_id: number;
  status: ChallengeStatusType;
  actual_start: string | null;
  actual_end: string | null;
}

export interface Database {
  public: {
    Tables: {
      challenges: {
        Row: Challenge;
        Insert: Omit<Challenge, "id">;
        Update: Partial<Omit<Challenge, "id">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id">;
        Update: Partial<Omit<Project, "id">>;
      };
      checklist_items: {
        Row: ChecklistItem;
        Insert: Omit<ChecklistItem, "id" | "created_at"> & { created_at?: string };
        Update: Partial<Omit<ChecklistItem, "id">>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, "id" | "updated_at"> & { updated_at?: string };
        Update: Partial<Omit<Note, "id">>;
      };
      challenge_status: {
        Row: ChallengeStatus;
        Insert: Omit<ChallengeStatus, "id">;
        Update: Partial<Omit<ChallengeStatus, "id">>;
      };
    };
  };
}
