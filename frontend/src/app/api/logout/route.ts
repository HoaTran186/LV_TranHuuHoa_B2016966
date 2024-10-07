import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("Token", "", { expires: new Date(0) });
  response.cookies.set("NID", "", { expires: new Date(0) });

  return response;
}
