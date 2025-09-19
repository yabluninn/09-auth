import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { sessionServer } from "@/lib/api/serverApi";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPrivate = pathname.startsWith("/(private routes)");
  const isAuthRoute = pathname.startsWith("/(auth routes)");

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated && refreshToken) {
    try {
      const res = await sessionServer();
      if (res.status === 200 && res.data && typeof res.data === "object") {
        isAuthenticated = true;
      }
    } catch {}
  }

  if (isPrivate && !isAuthenticated) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const url = new URL("/profile", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(private routes)/(.*)", "/(auth routes)/(.*)"],
};
