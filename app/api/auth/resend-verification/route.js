import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const tokenExpire = Date.now() + 1000 * 60 * 30; // 30 min

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = tokenExpire;
    await user.save();

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    const html = `
      <div style="font-family:sans-serif;">
        <h2>Verify your email again</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}" style="background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a>
      </div>
    `;

    await sendEmail({ to: email, subject: "Resend Email Verification", html });

    return NextResponse.json({ message: "Verification email sent again." });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
