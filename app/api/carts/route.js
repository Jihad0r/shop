import { dbConnect } from "@/lib/config/db";
import Cart from "@/lib/models/Cart";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";


export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId || userId === process.env.Admin ) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
        }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    return NextResponse.json(cart || { items: [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PATCH(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId || userId === process.env.Admin ) {
          return NextResponse.json({ error: "Users only" }, { status: 403 });
        }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    return NextResponse.json(cart || { items: [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}