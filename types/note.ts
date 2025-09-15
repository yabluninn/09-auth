// types/note.ts
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
export type Tag = NoteTag | "All";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: Tag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}
