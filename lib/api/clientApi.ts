import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ---------- AUTH ----------
export async function loginClient(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function registerClient(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function logoutClient(): Promise<void> {
  await api.post("/auth/logout");
}

export async function sessionClient(): Promise<User | null> {
  const { data, status } = await api.get<User | "">("/auth/session");
  if (status === 200 && data && typeof data === "object") return data as User;
  return null;
}

// ---------- USERS ----------
export async function updateMeClient(
  payload: Partial<Pick<User, "username">>
): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

// ---------- NOTES ----------
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

export async function fetchNotesClient(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage,
  };
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.tag && params.tag !== "All") query.tag = params.tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: query,
  });
  return data;
}

export async function fetchNoteByIdClient(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNoteClient(
  payload: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNoteClient(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
