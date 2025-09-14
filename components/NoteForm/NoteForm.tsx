"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteClient } from "@/lib/api/clientApi";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { Note } from "@/types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [local, setLocal] = useState(draft ?? initialDraft);

  useEffect(() => {
    setLocal(draft ?? initialDraft);
  }, [draft]);

  const mutation = useMutation({
    mutationFn: (payload: Omit<Note, "id" | "createdAt" | "updatedAt">) =>
      createNoteClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      title: local.title.trim(),
      content: local.content.trim(),
      tag: local.tag as Note["tag"],
    };
    if (!payload.title) return;
    mutation.mutate(payload);
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={local.title}
          onChange={(e) => {
            const v = e.target.value;
            setLocal((s) => ({ ...s, title: v }));
            setDraft({ title: v });
          }}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          rows={8}
          value={local.content}
          onChange={(e) => {
            const v = e.target.value;
            setLocal((s) => ({ ...s, content: v }));
            setDraft({ content: v });
          }}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={local.tag}
          onChange={(e) => {
            const v = e.target.value as Note["tag"];
            setLocal((s) => ({ ...s, tag: v }));
            setDraft({ tag: v });
          }}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
