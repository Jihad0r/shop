import { dbConnect } from "@/lib/config/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest } from "@/utils/getUserFromToken";
import User from "@/lib/models/User";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user || String(user?._id) !== process.env.Admin ) {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }
    let product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const price = Number(formData.get("price"));
    let imagefile = formData.get("image");
    const inStock = formData.get("inStock");
    const category = formData.get("category");
    const description = formData.get("description");

    if (imagefile && typeof imagefile === "object") {
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const buffer = await imagefile.arrayBuffer();
      const mime = imagefile.type;
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUri = `data:${mime};base64,${base64}`;

      const uploadedResponse = await cloudinary.uploader.upload(dataUri);
      imagefile = uploadedResponse.secure_url;
    } else {
      imagefile = product.image; 
    }

    product.title = title || product.title;
    product.price = price || product.price;
    product.image = imagefile || product.image;
    product.inStock = inStock || product.inStock;
    product.category = category || product.category;
    product.description = description || product.description;

    await product.save();

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req,{ params }) {
  try {
    await dbConnect();
    
    const { id: productId } = await params;

    let product = await Product.findById(productId).populate("reviews.user", "username"); ;
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const userId = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user || String(user?._id) !== process.env.Admin) {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }

    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
