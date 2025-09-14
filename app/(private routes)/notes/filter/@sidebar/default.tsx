import Link from "next/link";
import css from "../../../../components/Sidebar/SidebarNotes.module.css";

const TAGS = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export default function SidebarDefault() {
  return (
    <ul className={css.menuList}>
      {TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag === "All" ? "All notes" : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
