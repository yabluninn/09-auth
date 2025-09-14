import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotesServer } from "@/lib/api/serverApi";
import { headers } from "next/headers";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

const PER_PAGE = 12;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const ALLOWED = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;
type Tag = (typeof ALLOWED)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = (slug?.[0] ?? "All") as string;
  const tag: Tag = (ALLOWED as readonly string[]).includes(raw)
    ? (raw as Tag)
    : "All";

  const title =
    tag === "All" ? "All notes | NoteHub" : `${tag} notes | NoteHub`;
  const description =
    tag === "All"
      ? "Перегляд усіх нотаток у NoteHub."
      : `Перегляд нотаток з тегом "${tag}" у NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesFilteredPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const raw = (slug?.[0] ?? "All") as string;
  const tag: Tag = (ALLOWED as readonly string[]).includes(raw)
    ? (raw as Tag)
    : "All";
  const cookie = (await headers()).get("cookie") ?? undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotesServer({ page: 1, perPage: 12, tag }, cookie),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
