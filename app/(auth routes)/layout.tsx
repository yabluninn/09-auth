"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
