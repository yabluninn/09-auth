"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./note-preview.module.css";

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const onClose = () => router.back();

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}
        {(error || !note) && !isLoading && <p>Something went wrong.</p>}
        {note && (
          <>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.date}>{note.createdAt}</p>
          </>
        )}
      </div>
    </Modal>
  );
}
