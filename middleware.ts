import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const PUBLIC_AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublicAuth = PUBLIC_AUTH_ROUTES.includes(pathname);

  const jar = cookies().toString(); // serializes cookies: "k=v; k2=v2"
  const hasAccess = jar.includes("accessToken=");
  const hasRefresh = jar.includes("refreshToken=");

  let authenticated = false;

  if (hasAccess) {
    authenticated = true;
  } else if (!hasAccess && hasRefresh) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${base}/api/auth/session`, {
        method: "GET",
        headers: { cookie: jar },
        credentials: "include",
      });
      if (res.status === 200) {
        const data = await res.json().catch(() => null);
        authenticated = !!data && typeof data === "object";
      }
    } catch {
      authenticated = false;
    }
  }

  // защита приватных страниц
  if (isPrivate && !authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // редирект с публичных auth-страниц, если уже авторизован — на домашнюю
  if (isPublicAuth && authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// запускаем только там, где нужно
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
