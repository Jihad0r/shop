import { dbConnect } from "@/lib/config/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const categoryName = decodeURIComponent(params.category); // Decode URL names

    // Find all products in the given category (case-insensitive)
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName}$`, "i") }
    });

    if (!products.length) {
      return NextResponse.json({ error: "No products found in this category" }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });

  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
