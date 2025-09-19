"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { updateMeClient } from "@/lib/api/clientApi";
import { sessionClient } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated, clearIsAuthenticated } =
    useAuthStore();
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Если store пустой — синхронизируемся по сессии (CSR)
    (async () => {
      if (!user) {
        const me = await sessionClient();
        if (!me) {
          clearIsAuthenticated();
          router.replace("/sign-in");
          return;
        }
        setUser(me);
        setUsername(me.username);
        setEmail(me.email);
        setAvatar(me.avatar);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateMeClient({ username });
      // ВАЖНО: обновляем глобальный store
      setUser(updated);
      router.replace("/profile");
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    router.back();
  }

  if (!isAuthenticated && !user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {avatar && (
          <Image
            src={avatar}
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

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
