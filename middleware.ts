import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "mpk_admin_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApiRoute = pathname.startsWith("/api/peserta");

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (isAdminRoute || isAdminApiRoute) {
    if (!token) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: "Akses tidak diizinkan. Silakan login sebagai admin terlebih dahulu." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika admin sudah login dan mencoba mengakses /admin/login
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/peserta/:path*"],
};
