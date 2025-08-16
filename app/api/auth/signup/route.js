import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokensAndSetCookie } from "@/middleware/generateToken";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ field: "email", error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 10) {
      return NextResponse.json({ field: "password", error: "Password must be at least 10 characters" }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const isEmailTaken = existingUser.email === email;
      return NextResponse.json({
        error: isEmailTaken ? "Email already in use" : "Username already taken"
      }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    const safeUser = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    let response = NextResponse.json(safeUser, { status: 201 });

    await generateTokensAndSetCookie(newUser._id, response);
    return response;

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
