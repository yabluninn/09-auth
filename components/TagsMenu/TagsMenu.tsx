"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TAGS = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className={css.menuContainer} ref={ref}>
      <button
        className={css.menuButton}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList} role="menu">
          {TAGS.map((tag) => (
            <li key={tag} className={css.menuItem} role="none">
              <Link
                className={css.menuLink}
                role="menuitem"
                href={`/notes/filter/${tag}`}
                onClick={() => setOpen(false)}
              >
                {tag === "All" ? "All notes" : tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
