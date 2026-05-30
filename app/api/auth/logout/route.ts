import { COOKIE_NAME } from "./../../../constants";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const cleared = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return new NextResponse(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Set-Cookie": cleared },
  });
}
