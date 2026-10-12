import { cookies } from "next/headers";

/** Matches the API's own token and cookie, so the two expire together. */
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token || typeof token !== "string") {
    return Response.json({ message: "token is required" }, { status: 400 });
  }

  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: THIRTY_DAYS,
    path: "/",
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete("token");

  return Response.json({ ok: true });
}
