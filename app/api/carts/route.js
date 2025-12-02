import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

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
      return NextResponse.json({ error: "admin only" }, { status: 400 });
    }

    const cart = await Cart.find().populate("items.product").populate("user");
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

