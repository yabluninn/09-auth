import { cookies } from "next/headers";
import { api } from "./api";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note, FetchNotesParams, FetchNotesResponse } from "@/types/note";

function buildCookieHeader(): { Cookie: string } | undefined {
  try {
    const raw = cookies().toString(); // "k1=v1; k2=v2"
    return raw ? { Cookie: raw } : undefined;
  } catch {
    return undefined;
  }
}

/* ===================== AUTH (server) ===================== */
export async function sessionServer(): Promise<AxiosResponse<User | "">> {
  return api.get<User | "">("/auth/session", {
    headers: buildCookieHeader(),
  });
}

/* ===================== USERS (server) ==================== */
export async function fetchMeServer(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: buildCookieHeader(),
  });
  return data;
}

/* ===================== NOTES (server) ==================== */
export async function fetchNotesServer(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;

  const q: Record<string, string | number> = { page, perPage };
  if (search?.trim()) q.search = search.trim();
  if (tag && tag !== "All") q.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: q,
    headers: buildCookieHeader(),
  });
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: buildCookieHeader(),
  });
  return data;
}
