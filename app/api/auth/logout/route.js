import { dbConnect } from "@/lib/config/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
