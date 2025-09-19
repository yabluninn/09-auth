import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import css from "./profile.module.css";
import { fetchMeServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your profile page in NoteHub",
  openGraph: {
    title: "Profile | NoteHub",
    description: "Your profile page in NoteHub",
    url: "/profile",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default async function ProfilePage() {
  const user = await fetchMeServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link
            href="/profile/edit"
            prefetch={false}
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
