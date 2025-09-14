"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotesClient } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

import css from "./Notes.module.css";

const PER_PAGE = 12;
type FilterTag = Note["tag"] | "All";

export default function NotesClient({ initialTag }: { initialTag: FilterTag }) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const [tag, setTag] = useState<FilterTag>(initialTag);

  useEffect(() => {
    setTag(initialTag);
    setPage(1);
  }, [initialTag]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotesClient({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag,
      }),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isPending && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}

      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && !isPending && <p>No notes found.</p>}
    </div>
  );
}
