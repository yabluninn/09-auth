import axios from "axios";
import type { Note } from "@/types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers = { Authorization: `Bearer ${TOKEN}` };

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: Note["tag"] | "All";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search?.trim()) params.search = search.trim();

  if (tag && tag !== "All") params.tag = tag;

  const { data } = await axios.get<FetchNotesResponse>(API_URL, {
    params,
    headers,
  });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const { data } = await axios.get<Note>(`${API_URL}/${id}`, { headers });
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
) => {
  const { data } = await axios.post<Note>(API_URL, note, { headers });
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return data;
};
