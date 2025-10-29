import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokensAndSetCookie } from "@/lib/middleware/generateToken";


export async function POST(req) {
   try {
    await dbConnect();

    const formData = await req.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    if (user.state === "discontinue") {
      return NextResponse.json({ error: "User is not Allow to login at the time" }, { status: 401 });
    }

    const response = NextResponse.json({
      username: user.username,
      email: user.email,
    }, { status: 200 });

    generateTokensAndSetCookie(user._id, response);
    return response;


  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
