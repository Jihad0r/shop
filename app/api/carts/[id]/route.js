import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId || userId === process.env.Admin ) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
        }
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: product._id, quantity: 1, price: product.price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product._id.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product: product._id, quantity: 1, price: product.price });
      }
    }

    await cart.save();

    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId || userId === process.env.Admin ) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
        }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return NextResponse.json({ message: "Cart is empty" });
    }

    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
   if (!userId || userId === process.env.Admin ) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
        }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== params.id
    );

    await cart.save();

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
