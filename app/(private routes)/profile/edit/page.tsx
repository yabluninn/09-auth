"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./EditProfilePage.module.css";
import { updateMeClient, sessionClient } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await sessionClient();
      if (user) {
        setUsername(user.username || "");
        setEmail(user.email);
        setAvatarURL(user.avatarURL || undefined);
      } else {
        router.push("/sign-in");
      }
    })();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMeClient({ username: username.trim() });
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {avatarURL ? (
          <Image
            src={avatarURL}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        ) : (
          <Image
            src="/placeholder-avatar.png"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email || "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={saving}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
