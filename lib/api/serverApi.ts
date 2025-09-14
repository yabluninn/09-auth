import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

function h(cookie?: string) {
  return cookie ? { headers: { cookie } } : {};
}

export async function getMeServer(cookie?: string): Promise<User> {
  const { data } = await api.get<User>("/users/me", h(cookie));
  return data;
}

export async function fetchNotesServer(
  params: FetchNotesParams,
  cookie?: string
): Promise<FetchNotesResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage,
  };
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.tag && params.tag !== "All") query.tag = params.tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: query,
    ...h(cookie),
  });
  return data;
}

export async function fetchNoteByIdServer(
  id: string,
  cookie?: string
): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, h(cookie));
  return data;
}
