// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuth =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const jar = (await cookies()).toString(); // "k1=v1; k2=v2"
  const hasAccess = /(^|;\s*)accessToken=/.test(jar);
  const hasRefresh = /(^|;\s*)refreshToken=/.test(jar);

  if (isAuth && hasAccess) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPrivate) {
    if (hasAccess) return NextResponse.next();

    if (hasRefresh) {
      const sessionUrl = new URL("/api/auth/session", origin);
      const resp = await fetch(sessionUrl, {
        method: "GET",
        headers: { cookie: jar },
        credentials: "include",
      });

      if (resp.ok) {
        const setCookie = resp.headers.get("set-cookie");
        const next = NextResponse.next();
        if (setCookie) {
          next.headers.set("set-cookie", setCookie);
        }
        return next;
      }
    }

    const login = new URL("/sign-in", req.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
