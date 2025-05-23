import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value; // menjaćeš ovo kad ubacimo cookie

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/courier"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*"],
};
