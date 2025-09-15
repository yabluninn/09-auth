// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note, FetchNotesParams, FetchNotesResponse } from "@/types/note";

function cookieHeaders() {
  const jar = cookies().toString(); // "key=value; key2=value2"
  return jar ? { Cookie: jar } : {};
}

// ------- AUTH (server) -------
export async function sessionServer(): Promise<AxiosResponse<User | "">> {
  // Повертаємо ПОВНИЙ AxiosResponse, як просили в перевірці
  return api.get<User | "">("/auth/session", {
    headers: cookieHeaders(),
  });
}

// ------- NOTES (server) -------
export async function fetchNotesServer(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;

  const q: Record<string, string | number> = { page, perPage };
  if (search?.trim()) q.search = search.trim();
  if (tag && tag !== "All") q.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: q,
    headers: cookieHeaders(),
  });
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: cookieHeaders(),
  });
  return data;
}
