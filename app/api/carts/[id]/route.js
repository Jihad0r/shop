import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = await params;
    const { quantity } = await req.json();
    const qty = Math.max(1, quantity || 1);
    const userId = await getUserFromRequest(req);

    if (!userId || userId === process.env.Admin) {
      return NextResponse.json({ error: "Users only" }, { status: 403 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check stock before adding to cart
    if (product.inStock < qty) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    let cart = await Cart.findOne({ user: userId });

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

    product.inStock -= qty;
    await product.save();

    await cart.save();

    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = params;

    const result = await Cart.aggregate([
      { $unwind: "$items" }, 
      { $match: { "items.product": new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          userCount: { $sum: 1 }
        }
      }
    ]);

    if (!result || result.length === 0) {
      return NextResponse.json({ message: "No orders for this product" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = await params;
    const userId = await getUserFromRequest(req);

    if (!userId || userId === process.env.Admin) {
      return NextResponse.json({ error: "Users only" }, { status: 403 });
    }
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }


    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemInCart = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (!itemInCart) {
      return NextResponse.json({ error: "Product not in cart" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    if (product) {
      product.inStock = Number(product.inStock) + itemInCart.quantity;
      await product.save();
    }

    await cart.save();


    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
