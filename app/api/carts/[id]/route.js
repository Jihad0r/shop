import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await dbConnect();

    const { id: productId } = await params;
    const { quantity } = await req.json();
    const qty = Math.max(1, quantity || 1);

    // Find and lock the product document
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    if (product.inStock < qty) {
      await session.abortTransaction();
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const userId = await getUserFromRequest(req);
    let cart;
    let sessionId;

    if (!userId) {
      // Guest user flow
      sessionId = (await cookies()).get("guest_session_id")?.value;
      
      if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      cart = await Cart.findOne({ sessionId }).session(session);
      
      if (!cart) {
        cart = new Cart({
          sessionId,
          isGuest: true,
          items: [{ product: product._id, quantity: qty, price: product.price }],
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === product._id.toString()
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += qty;
        } else {
          cart.items.push({ product: product._id, quantity: qty, price: product.price });
        }
      }
    } else {
      // Authenticated user flow
      cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [{ product: product._id, quantity: qty, price: product.price }],
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === product._id.toString()
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += qty;
        } else {
          cart.items.push({ product: product._id, quantity: qty, price: product.price });
        }
      }
    }

    // Decrement stock atomically
    product.inStock -= qty;
    await product.save({ session });
    await cart.save({ session });
    
    await session.commitTransaction();
    
    const response = NextResponse.json(cart);
    
    if (!userId && sessionId) {
      response.cookies.set("guest_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
    
    return response;

  } catch (err) {
    await session.abortTransaction();
    console.error('Cart POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    session.endSession();
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = await params;
    const userId = await getUserFromRequest(req);
    let cart;

    if (!userId) {
      // Guest user flow
      const sessionId = (await cookies()).get("guest_session_id")?.value;
      
      if (!sessionId) {
        return NextResponse.json({ error: "No guest session found" }, { status: 404 });
      }
      
      cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
    } else {
      // Authenticated user flow
      cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find product in cart
    const itemInCart = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );
    
    if (!itemInCart) {
      return NextResponse.json({ error: "Product not in cart" }, { status: 404 });
    }

    // Remove product from cart (NO stock restoration)
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();

    return NextResponse.json({ message: "Product removed from cart", cart });
    
  } catch (err) {
    console.error('Cart PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = await params;
    const userId = await getUserFromRequest(req);
    let cart;

    if (!userId) {
      // Guest user flow
      const cookieStore = await cookies();
      const sessionId = cookieStore.get("guest_session_id")?.value;
      
      if (!sessionId) {
        return NextResponse.json({ error: "No guest session found" }, { status: 404 });
      }
      
      cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
    } else {
      // Authenticated user flow
      cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Product not in cart" }, { status: 404 });
    }

    // Remove from cart (NO stock restoration)
    cart.items.splice(itemIndex, 1);
    await cart.save();

    return NextResponse.json({ message: "Product removed from cart", cart });
    
  } catch (err) {
    console.error("Delete cart item error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}