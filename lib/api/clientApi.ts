import { api } from "./api";
import type { User } from "@/types/user";
import type { Note, FetchNotesParams, FetchNotesResponse } from "@/types/note";

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
export async function fetchNotesClient(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const {
    page = 1,
    perPage = 12, // дефолт
    search,
    tag,
  } = params;

  const query: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search?.trim()) query.search = search.trim();
  if (tag && tag !== "All") query.tag = tag;

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
