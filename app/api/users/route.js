import { dbConnect } from "@/lib/config/db";
import User from "@/lib/models/User";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

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
    const users = await User.find().select("-password");
    return NextResponse.json({users});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);

    const currentUser = await User.findById(userId).select("-password");
    
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is admin
    const isAdmin = currentUser._id.toString() === process.env.Admin?.toString();
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 });
    }

    // Get the target user ID and new role from request body
    const body = await req.json();
    const { targetUserId, role } = body;

    if (!targetUserId || !role) {
      return NextResponse.json({ error: "Target user ID and role are required" }, { status: 400 });
    }

    // Validate role
    const validRoles = ['user', 'admin', 'editor']; 
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the target user's role
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { role: role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "User role updated successfully", 
      user: updatedUser 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



