import { NextResponse, type NextRequest } from "next/server";

/**
 * Sends visitors without a session to /login before any dashboard page loads.
 * This is only a quick check — the API still verifies the token on every call.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
