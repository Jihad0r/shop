import { dbConnect } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import User from "@/lib/models/User";

// UPDATE user role and state
export async function PATCH(req) {
  try {
    await dbConnect(); 

    const userId = await getUserFromRequest(req);
    const currentUser = await User.findById(userId).select("-password");
    
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is admin
    const isAdmin = currentUser.role !== "user";
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 });
    }

    // Get the target user ID, role, and state from request body
    const body = await req.json();
    const { targetUserId, role, state } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['user', 'admin', 'editor']; 
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
    }

    // Validate state if provided
    if (state) {
      const validStates = ["active", "blocked", "discontinue"]; 
      if (!validStates.includes(state)) {
        return NextResponse.json({ error: "Invalid state" }, { status: 400 });
      }
    }

    // Build update object
    const updateData = {};
    if (role) updateData.role = role;
    if (state) updateData.state = state;

    // Update the target user
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "User updated successfully", 
      user: updatedUser 
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE user (create this in a separate file: /api/users/user/[id]/route.js)
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(userId).select("-password");

    if (currentUser.role === "user") {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }

    const deleteUser = await User.findByIdAndDelete(params.id);
    if (!deleteUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}