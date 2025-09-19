import { cookies } from "next/headers";
import { api } from "./api";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note, FetchNotesParams, FetchNotesResponse } from "@/types/note";

/** Собираем header Cookie из текущего request context */
function cookieHeaders() {
  // .toString() вернёт строку "k=v; k2=v2"
  const jar = cookies().toString();
  return jar ? { Cookie: jar } : {};
}

/** Проверка сессии — возвращаем ПОЛНЫЙ AxiosResponse (так просили) */
export async function sessionServer(): Promise<AxiosResponse<User | "">> {
  return api.get<User | "">("/auth/session", {
    headers: cookieHeaders(),
  });
}

/** Текущий пользователь */
export async function fetchMeServer(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: cookieHeaders(),
  });
  return data;
}

/** Список заметок (SSR) */
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

/** Одна заметка (SSR) */
export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: cookieHeaders(),
  });
  return data;
}
