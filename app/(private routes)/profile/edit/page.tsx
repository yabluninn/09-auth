"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";
import { sessionClient, updateMeClient } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [user, setLocalUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await sessionClient();
      if (!u) {
        router.replace("/sign-in");
        return;
      }
      setLocalUser(u);
      setUsername(u.username);
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setSubmitting(true);
      const updated = await updateMeClient({ username: username.trim() });
      setUser(updated);
      router.push("/profile");
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => router.back();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <p>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={submitting}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
