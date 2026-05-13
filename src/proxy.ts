import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const PUBLIC_PREFIXES = [
  "/api/auth",
  "/api/webhooks",
  "/api/jobs",
  "/_next",
  "/instrutores",   // instructor search + public profiles
  "/entrar",
  "/cadastro",
  "/recuperar-senha",
  "/nova-senha",
];

const PUBLIC_EXACT = ["/", "/para-instrutores", "/buscar", "/sobre", "/403", "/termos", "/privacidade"];

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname);

  // Redirect logged-in users away from auth pages to their dashboard
  if (session?.user && (pathname === "/entrar" || pathname.startsWith("/cadastro"))) {
    const { role, instructorStatus } = session.user;
    if (role === "INSTRUCTOR") {
      return NextResponse.redirect(
        new URL(instructorStatus === "ACTIVE" ? "/instructor/aulas" : "/instructor/onboarding", req.url),
      );
    }
    if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/aulas", req.url));
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/documentos", req.url));
    }
  }

  // Redirect logged-in users from landing page to their dashboard
  if (session?.user && pathname === "/") {
    const { role, instructorStatus } = session.user;
    if (role === "INSTRUCTOR") {
      return NextResponse.redirect(
        new URL(instructorStatus === "ACTIVE" ? "/instructor/aulas" : "/instructor/onboarding", req.url),
      );
    }
    if (role === "STUDENT") return NextResponse.redirect(new URL("/aulas", req.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/documentos", req.url));
  }

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

  // INSTRUCTOR not ACTIVE → onboarding (except Stripe sub-routes which are part of onboarding)
  if (
    role === "INSTRUCTOR" &&
    instructorStatus !== "ACTIVE" &&
    !pathname.startsWith("/instructor/onboarding")
  ) {
    return NextResponse.redirect(new URL("/instructor/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
