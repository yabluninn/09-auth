import { api } from "./api";
import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const PER_PAGE = 12;

async function authHeaders() {
  const c = await cookies();
  const access = c.get("accessToken")?.value;
  const refresh = c.get("refreshToken")?.value;
  const cookieHeader = [
    access && `accessToken=${access}`,
    refresh && `refreshToken=${refresh}`,
  ]
    .filter(Boolean)
    .join("; ");
  return cookieHeader ? { cookie: cookieHeader } : {};
}

// -------- Notes (server) --------
export async function fetchNotesServer(params: {
  page?: number;
  search?: string;
  tag?: Note["tag"] | "All";
}) {
  const headers = await authHeaders();
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      headers,
      withCredentials: true,
      params: {
        perPage: PER_PAGE,
        page: params.page ?? 1,
        search: params.search ?? "",
        tag: params.tag && params.tag !== "All" ? params.tag : undefined,
      },
    }
  );
  return data;
}

export async function fetchNoteByIdServer(id: string) {
  const headers = await authHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers,
    withCredentials: true,
  });
  return data;
}

// -------- Users (server) --------
export async function getMeServer(): Promise<User> {
  const headers = await authHeaders();
  const { data } = await api.get<User>("/users/me", {
    headers,
    withCredentials: true,
  });
  return data;
}

export async function updateMeServer(
  payload: Partial<Pick<User, "username">>
): Promise<User> {
  const headers = await authHeaders();
  const { data } = await api.patch<User>("/users/me", payload, {
    headers,
    withCredentials: true,
  });
  return data;
}

export async function getSessionServer(): Promise<
  AxiosResponse<User | undefined>
> {
  const headers = await authHeaders();
  return api.get<User | undefined>("/auth/session", {
    headers,
    withCredentials: true,
  });
}
