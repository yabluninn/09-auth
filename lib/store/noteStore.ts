"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@/types/note";

export const initialDraft: Pick<Note, "title" | "content" | "tag"> = {
  title: "",
  content: "",
  tag: "Todo",
};

type Draft = typeof initialDraft;

type NoteStore = {
  draft: Draft;
  setDraft: (next: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (next) => set({ draft: { ...get().draft, ...next } }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub_draft",
      skipHydration: false,
    }
  )
);
