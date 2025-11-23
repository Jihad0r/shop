import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { cookies } from "next/headers";

export async function PATCH(req) {
  try {
    await dbConnect();

    const orderinfo = await req.json();
    
    // Validate that we have at least some order info
    if (!orderinfo || Object.keys(orderinfo).length === 0) {
      return NextResponse.json(
        { error: "Order info is required" },
        { status: 400 }
      );
    }

    const userId = await getUserFromRequest(req);
    const allowedOrderFields = [
      'firstName',
      'lastName',
      'city',
      'phone',
      'postCode',
      'goverment',
      'street'
    ];

    // Filter to only allowed fields
    const filteredOrderInfo = {};
    for (const field of allowedOrderFields) {
      if (orderinfo[field] !== undefined) {
        filteredOrderInfo[field] = orderinfo[field];
      }
    }

    if (Object.keys(filteredOrderInfo).length === 0) {
      return NextResponse.json(
        { error: "No valid order info fields provided" },
        { status: 400 }
      );
    }

    if (!userId) {
      // Guest user flow - update cart's orderinfo
      const cookieStore = await cookies();
      const sessionId = cookieStore.get("guest_session_id")?.value;

      if (!sessionId) {
        return NextResponse.json(
          { error: "No session found. Please add items to cart first." },
          { status: 404 }
        );
      }

      const cart = await Cart.findOne({ sessionId });

      if (!cart) {
        return NextResponse.json(
          { error: "Cart not found" },
          { status: 404 }
        );
      }

      // Merge with existing orderinfo
      const updatedOrderInfo = cart.orderinfo
        ? { ...cart.orderinfo.toObject(), ...filteredOrderInfo }
        : filteredOrderInfo;

      cart.orderinfo = updatedOrderInfo;
      await cart.save();

      console.log('Updated guest orderinfo:', updatedOrderInfo);

      return NextResponse.json({
        success: true,
        message: "Order info updated successfully",
        orderinfo: updatedOrderInfo
      });

    } else {
      // Authenticated user flow - update BOTH user's orderinfo AND cart's orderinfo
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const cart = await Cart.findOne({ user: userId })

       if (!cart) {
        return NextResponse.json(
          { error: "Cart not found" },
          { status: 404 }
        );
      }

      // Merge with existing cart orderinfo
        const updatedOrderInfo = cart.orderinfo
          ? { ...cart.orderinfo.toObject(), ...filteredOrderInfo }
          : filteredOrderInfo;

      console.log("Order",updatedOrderInfo);
          
      cart.orderinfo = updatedOrderInfo;
      await cart.save();

      return NextResponse.json({
        success: true,
        message: "Order info updated successfully",
        orderinfo: updatedOrderInfo
      });
    }

  } catch (err) {
    console.error('Order info update error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// GET /api/orderinfo - Retrieve current order info
export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);

    if (!userId) {
      // Guest user flow
      const cookieStore = await cookies();
      const sessionId = cookieStore.get("guest_session_id")?.value;

      if (!sessionId) {
        return NextResponse.json(
          { orderinfo: null },
          { status: 200 }
        );
      }

      const cart = await Cart.findOne({ sessionId });

      return NextResponse.json({
        orderinfo: cart?.orderinfo || null
      });

    } else {
      // Authenticated user flow
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        orderinfo: currentUser.orderinfo || null
      });
    }

  } catch (err) {
    console.error('Order info retrieval error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}