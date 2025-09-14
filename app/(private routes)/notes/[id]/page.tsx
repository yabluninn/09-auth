import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";

import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";
import { headers } from "next/headers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const cookie = (await headers()).get("cookie") ?? undefined;
    const note = await fetchNoteByIdServer(id, cookie);
    const title = `${note.title} | NoteHub`;
    const description = note.content
      ? `${note.content.slice(0, 120)}${note.content.length > 120 ? "…" : ""}`
      : "Перегляд нотатки у NoteHub.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    const title = `Note ${id} | NoteHub`;
    const description = "Перегляд нотатки у NoteHub.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookie = (await headers()).get("cookie") ?? undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id, cookie),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
