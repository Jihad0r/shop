import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";

import Product from "@/lib/models/Product"; 
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";

export async function GET(req) {
  try {
    await dbConnect();
    
    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cart = await Cart
      .findOne({ user: userId })
      .populate("items.product");
    
    // If no cart exists, return empty cart structure
    if (!cart) {
      return NextResponse.json(
        { 
          user: userId,
          items: [],
          totalPrice: 0 
        }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json(cart, { status: 200 });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function PATCH(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    return NextResponse.json(cart || { items: [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}