import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;

  const origin = nextUrl.origin;
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const res = await fetch(`${origin}/api/auth/session`, {
    method: "GET",
    headers: {
      cookie: headers.get("cookie") || "",
    },
  });

  const authed =
    res.status === 200 &&
    (await res
      .clone()
      .json()
      .catch(() => null));

  if (isPrivate && !authed) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && authed) {
    const url = new URL("/profile", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((private routes)/(.*))",
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
