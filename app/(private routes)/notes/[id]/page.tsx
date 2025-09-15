import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NoteDetails from "./NoteDetails.client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);

  const title = `${note.title} | NoteHub`;
  const description = note.content
    ? `${note.content.slice(0, 120)}${note.content.length > 120 ? "…" : ""}`
    : "Note details";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
    staleTime: 30_000,
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetails />
    </HydrationBoundary>
  );
}
