import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const PUBLIC_PREFIXES = [
  "/api/auth",
  "/_next",
  "/instrutor/", // public instructor profiles
];

const PUBLIC_EXACT = ["/", "/buscar", "/entrar", "/cadastro", "/sobre", "/403"];

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname);

  if (isPublic) return NextResponse.next();

  // Unauthenticated → login
  if (!session?.user) {
    const loginUrl = new URL("/entrar", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { role, instructorStatus } = session.user;

  // Role isolation
  if (role === "STUDENT" && (pathname.startsWith("/instructor") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (role === "INSTRUCTOR" && (pathname.startsWith("/admin") || pathname.startsWith("/student"))) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (role === "ADMIN" && (pathname.startsWith("/student") || pathname.startsWith("/instructor"))) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  // INSTRUCTOR not ACTIVE → onboarding
  if (role === "INSTRUCTOR" && instructorStatus !== "ACTIVE" && !pathname.startsWith("/instructor/onboarding")) {
    return NextResponse.redirect(new URL("/instructor/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
