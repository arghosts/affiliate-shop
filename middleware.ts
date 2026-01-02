import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  const isAdminPath = path.startsWith("/admin");

  // Ambil cookie session
  const cookie = request.cookies.get("admin_session")?.value;
  
  // Verifikasi (jika ada cookie)
  const session = cookie ? await verifySession(cookie) : null;

  // SCENARIO 1: User belum login, mencoba masuk Admin -> Tendang ke Login
  if (isAdminPath && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // SCENARIO 2: User sudah login, mencoba masuk Login -> Tendang ke Dashboard
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang dicek middleware
export const config = {
  matcher: ["/admin/:path*", "/login"],
};