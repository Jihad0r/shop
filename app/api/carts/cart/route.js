import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await dbConnect();

    let cart = null;
    let userId = null;
    let sessionId = null;

    // Try to get authenticated user first
    try {
      userId = await getUserFromRequest(req);
    } catch (authError) {
      // User not authenticated, will try guest session
      console.log("No authenticated user, checking guest session");
    }

    if (userId) {
      // Fetch authenticated user's cart
      cart = await Cart.findOne({ user: userId })
        .populate({
          path: "items.product",
          select: "image title price inStock",
        })
        .lean();
    } else {
      // Try guest session
      const cookieStore = await cookies();
      sessionId = cookieStore.get("guest_session_id")?.value;
      
      if (sessionId) {
        cart = await Cart.findOne({ sessionId, isGuest: true })
          .populate({
            path: "items.product",
            select: "image title price inStock",
          })
          .lean();
      }
    }

    // Return cart or empty structure
    return NextResponse.json(cart || { items: [] });
    
  } catch (err) {
    console.error("Error fetching cart:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: err.message }, 
      { status: 500 }
    );
  }
}