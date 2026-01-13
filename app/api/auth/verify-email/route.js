import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-failed?reason=invalid`
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 🔍 ابحث عن المستخدم بالتوكن فقط
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-failed?reason=invalid`
      );
    }
    console.log("isVerified: ",isVerified);
    
    if (user.isVerified) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/`
      );
    }

    if (user.emailVerificationExpire < Date.now()) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-failed?reason=expired`
      );
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verified-success`
    );

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify-failed?reason=server`
    );
  }
}
