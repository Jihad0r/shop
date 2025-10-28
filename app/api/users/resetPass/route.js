// import { dbConnect } from "@/lib/config/db";
// import User from "@/lib/models/User";
// import { getUserFromRequest } from "@/utils/getUserFromToken";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function PATCH(req) {
//   try {
//     await dbConnect();

//     const userId = await getUserFromRequest(req);
//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const { oldPassword, newPassword } = await req.json();

//     const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
//     if (!isPasswordCorrect) {
//       return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
//     }

//     if (newPassword.length < 10) {
//       return NextResponse.json({ field: "password", error: "Password must be at least 10 characters" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(newPassword, salt);

//     user.password = hash;
//     await user.save();

//     return NextResponse.json({ message: "Password reset successful. Please log in." });
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
//   }
// }

import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 10) {
      return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
