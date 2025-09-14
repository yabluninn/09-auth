"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sessionClient, logoutClient } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/notes", "/profile"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  const [checking, setChecking] = useState(true);

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    (async () => {
      try {
        const user = await sessionClient();
        if (user) {
          setUser(user);
        } else if (isPrivate) {
          await logoutClient().catch(() => {});
          clearIsAuthenticated();
          router.replace("/sign-in");
          return;
        }
      } finally {
        setChecking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (checking && isPrivate) {
    return <p style={{ padding: 16 }}>Loading...</p>;
  }

  return <>{children}</>;
}
