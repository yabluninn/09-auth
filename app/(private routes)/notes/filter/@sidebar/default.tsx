import Link from "next/link";
import css from "@/components/Sidebar/SidebarNotes.module.css";

const TAGS = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export default function DefaultSidebar() {
  return (
    <ul className={css.menuList}>
      {TAGS.map((tag) => (
        <li className={css.menuItem} key={tag}>
          <Link
            href={`/notes/filter/${tag}`}
            prefetch={false}
            className={css.menuLink}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
