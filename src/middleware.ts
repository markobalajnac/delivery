import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Provera cookie ili token za autentikaciju
  const token = request.cookies.get("session")?.value;

  if (!token) {
    // Nije ulogovan, preusmeri na login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Ovde možeš dodati proveru role ako želiš

  return NextResponse.next(); // pusti dalje
}

export const config = {
  matcher: ["/admin/:path*", "/courier/:path*"], // middleware važi samo za ove rute
};
