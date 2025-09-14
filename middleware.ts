import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasAccess = Boolean(req.cookies.get("accessToken")?.value);
  // const hasRefresh = Boolean(req.cookies.get("refreshToken")?.value);
  const isAuth = hasAccess; // || hasRefresh;

  const isPrivate =
    pathname.startsWith("/notes") || pathname.startsWith("/profile");

  if (isPrivate && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";

    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuth && isPublicPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
