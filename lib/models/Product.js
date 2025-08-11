import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Product title is required"], trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: [true, "Price is required"] },
    image: { type: String, required: [true, "Image is required"] },
    category: {
      type: String,
      enum: ["T-shirts", "shorts", "shoes", "coats", "others"],
      default: "others",
    },
    inStock: { type: String, required: [true, "InStock is required"] },
    rate: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
