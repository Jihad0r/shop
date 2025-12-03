import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail"; //what should i do // You'll need to implement this


export async function POST(req) {
  const startTime = Date.now();

  try {
    await dbConnect();

    const { email } = await req.json();

    // Validate email presence
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    
    
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    

    if (user.resetPasswordExpire && user.resetPasswordExpire > Date.now()) {
      const timeRemaining = Math.ceil((user.resetPasswordExpire - Date.now()) / 1000 / 60);
      console.log(`⏳ Recent reset request for ${email}. ${timeRemaining} minutes remaining.`);
      
      
      return NextResponse.json({ 
        message: "If that email exists, a reset link has been sent." 
      });
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
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/changePass?token=${resetToken}`;

    console.log("🔗 Password reset link:", resetLink);

    // Send email with reset link
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #007bff; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin: 20px 0;
                }
                .warning { color: #dc3545; font-weight: bold; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the button below to proceed:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
                <p class="warning">This link expires in 15 minutes.</p>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                <div class="footer">
                  <p>This is an automated message, please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `
      });
      
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Still return success to user (don't reveal if email failed)
    }
    console.log("resetToken:",resetToken);
    console.log("resetToken:",resetToken);
    
    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    
    
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}