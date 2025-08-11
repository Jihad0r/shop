// /api/users/me/route.js (example)
import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = user._id.toString() === process.env.Admin?.toString();

    return NextResponse.json({
      user,
      isAdmin, // Send only a boolean, not the actual ADMIN ID
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
