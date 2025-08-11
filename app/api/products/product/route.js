import { dbConnect } from "@/lib/config/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import User from "@/lib/models/User";
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user || String(user._id) !== process.env.Admin) {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get("title")?.trim();
    const price = Number(formData.get("price"));
    const imageFile = formData.get("image");
    const inStock =  Number(formData.get("inStock"));
    const category = formData.get("category")?.trim() || "others";
    const description = formData.get("description")?.trim() || "";

    if (!title || !price || !inStock) {
      return NextResponse.json({ error: "Title, price, and inStock are required" }, { status: 400 });
    }
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return NextResponse.json({ error: "Title already exists" }, { status: 400 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    if (!uploadedImage?.secure_url) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    const newProduct = await Product.create({
      title,
      price,
      image: uploadedImage.secure_url,
      inStock,
      category,
      description,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST /product error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user._id.toString() !== process.env.ADMIN?.toString()) {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }

    // 🗑 Delete all products
    await Product.deleteMany({});
    return NextResponse.json({ msg: "All products deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
