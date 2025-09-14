import type { Metadata } from "next";
import css from "./not-found.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "404 — Page not found | NoteHub",
  description: "Сторінку не знайдено. Вибачте, але ця сторінка не існує.",
  openGraph: {
    title: "404 — Page not found | NoteHub",
    description: "Сторінку не знайдено. Вибачте, але ця сторінка не існує.",
    url: `${SITE_URL}/404`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFoundPage() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
