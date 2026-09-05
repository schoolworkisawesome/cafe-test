import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = (req.auth?.user as any)?.role === "ADMIN";

  const adminOnlyPaths = ["/admin", "/notices/new"];
  const loginOnlyPaths = ["/board/new", "/news/new"];

  if (adminOnlyPaths.some((p) => pathname.startsWith(p))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  if (loginOnlyPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/notices/new", "/board/new", "/news/new"],
};
