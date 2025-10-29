import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const username = data.username;
    const email = data.email;
    const password = data.password;

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
      return NextResponse.json({
        error: existingUser.email === email ? "Email already in use" : "Username already taken",
      }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const tokenExpire = Date.now() + 1000 * 60 * 30; 

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpire: tokenExpire,
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>
        <p>Hi ${username}, please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display:inline-block; padding:10px 20px; background:#0070f3; color:white; border-radius:5px; text-decoration:none;">Verify Email</a>
        <p>This link will expire in 30 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: htmlMessage,
    });

    const safeUser = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    generateTokensAndSetCookie(newUser._id, safeUser);

    return NextResponse.json({
      message: "Signup successful! Please check your email to verify your account.",
      user: safeUser,
    }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
