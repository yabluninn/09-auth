import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivate =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");
  const publicRoute = isPublic(pathname);

  const cookieHeader = req.headers.get("cookie") || "";
  let isAuth = /(?:^|;\s*)accessToken=/.test(cookieHeader);
  const hasRefresh = /(?:^|;\s*)refreshToken=/.test(cookieHeader);

  let response: NextResponse | null = null;

  if (isPrivate && !isAuth && hasRefresh) {
    const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
      method: "POST",
      headers: { cookie: cookieHeader },
    });

    response = NextResponse.next();

    const setCookies =
      refreshRes.headers.getSetCookie?.() ??
      (refreshRes.headers.get("set-cookie")
        ? [refreshRes.headers.get("set-cookie") as string]
        : []);

    for (const c of setCookies) {
      response.headers.append("Set-Cookie", c);
      if (c?.startsWith("accessToken=")) isAuth = true;
    }
  }

  if (isPrivate && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuth && publicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response ?? NextResponse.next();
}

export const config = {
  matcher: ["/", "/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
