import { dbConnect } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// UPDATE user's own profile
export async function PATCH(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { username, email, password, currentPassword } = body;

    // Build update object with allowed fields only
    const updateData = {};

    // Username update
    if (username) {
      if (username !== currentUser.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }
        updateData.username = username.trim();
      }
    }

    // Email update
    if (email) {
      if (email !== currentUser.email) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }
        updateData.email = email.toLowerCase().trim();
        // Reset email verification when email changes
        updateData.isVerified = false;
      }
    }

    // Password update (requires current password)
    if (password) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
    ).select("-password -emailVerificationToken -resetPasswordToken");

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (err) {
    console.error('Profile update error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE user's own account
export async function DELETE(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { password, confirmDelete } = body;

    // Require password confirmation
    if (!password) {
      return NextResponse.json({ error: "Password is required to delete account" }, { status: 400 });
    }

    // Require explicit confirmation
    if (confirmDelete !== true) {
      return NextResponse.json({ error: "Please confirm account deletion" }, { status: 400 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, currentUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ 
      message: "Account deleted successfully" 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}