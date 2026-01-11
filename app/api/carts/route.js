import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";

import Product from "@/lib/models/Product"; 
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
<<<<<<< HEAD
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
=======
>>>>>>> 7bb97d6 (fix auth and product bugs)

export async function GET(req) {
  try {
    await dbConnect();
<<<<<<< HEAD

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
=======
    
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
>>>>>>> 7bb97d6 (fix auth and product bugs)
  } catch (err) {
    console.error("GET CART ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

<<<<<<< HEAD
=======
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
>>>>>>> 7bb97d6 (fix auth and product bugs)
