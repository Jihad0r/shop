import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validRoles = ['admin', 'editor']; 
    if (!validRoles.includes(user.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const users = await User.find({role:validRoles}).select("-password");
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
