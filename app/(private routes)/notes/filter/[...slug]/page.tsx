import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotesServer } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { Tag } from "@/types/note";

const TAGS: Tag[] = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"];

export default async function NotesByTagPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const rawTag = (slug?.[0] as Tag | undefined) ?? "All";
  const tag: Tag = TAGS.includes(rawTag) ? rawTag : "All";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotesServer({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
