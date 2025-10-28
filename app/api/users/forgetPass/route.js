import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal if the user exists for security reasons
      return NextResponse.json({ message: "If that email exists, a reset link was sent." });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 minutes

    // Save token to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // Create password reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPass?token=${resetToken}`;

    // TODO: Send this link to user's email (using nodemailer, resend, etc.)
    console.log("🔗 Password reset link:", resetLink);

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
