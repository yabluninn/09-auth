import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NotePreview from "./NotePreview.client";
import { headers } from "next/headers";

export default async function NotePreviewModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookie = (await headers()).get("cookie") ?? undefined;

  const qc = getQueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id, cookie),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
