import { dbConnect } from "@/lib/config/db";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id: productId } = await params;

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = await getUserFromRequest(req);
    console.log(userId);
    
    if (!userId) {
      return NextResponse.json({ error: "cant rate products, login first" }, { status: 401 });
    }

    if (userId === process.env.Admin) {
      return NextResponse.json({ error: "cant rate your product" }, { status: 401 });
    }

    const formData = await req.formData();
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment");

    if (!comment) {
      return NextResponse.json({ error: "Comment is empty" }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return NextResponse.json({ error: "Product already reviewed" }, { status: 400 });
    }

    const user = await User.findById(userId);

    const review = {
  user: userId,
  comment,
  rating,
  createdAt: new Date()
};

product.reviews.push(review);
product.rate =
  product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

await product.save();
console.log(review);
console.log(product.reviews);


return NextResponse.json(review, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
