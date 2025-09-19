import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAxiosError } from "axios";
import { fetchMeServer } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your profile in NoteHub",
  openGraph: {
    title: "Profile | NoteHub",
    description: "Your profile in NoteHub",
    url: "/profile",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default async function ProfilePage() {
  try {
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
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      redirect("/sign-in");
    }
    throw err;
  }
}
