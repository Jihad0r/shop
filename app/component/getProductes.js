"use client"
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Tag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(product.inStock);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleCart = async (e) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      const res = await fetch(`/api/carts/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result?.error || "Failed to add item");
      }
      
      toast.success(
        `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart successfully!`
      );
      
      setAvailableQuantity((prev) => Math.max(0, prev - quantity));
      setQuantity(1);
      
    } catch (err) {
      console.error("Cart error:", err);
      toast.error(err.message || "Error adding to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className="rounded-lg flex flex-col cursor-pointer relative"
    >
      <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
        <img
          className={`${
            product.category === "shoes" ? "object-contain" : "object-cover"
          } w-full h-full transition-transform duration-300 ease-in-out hover:scale-110`}
          src={product.image}
          alt={product.title}
        />
      </div>
      
      <div className="pt-4 flex-1 flex flex-col justify-between">
        {/* Category Badge */}
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {product.title}
        </h2>

        {/* Rating Section */}
        <div>
          {product.rate ? (
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-base">
                {[...Array(Math.ceil(product.rate))].map((_, i) => {
                  const fullStars = Math.floor(product.rate);
                  const hasHalf = product.rate % 1 !== 0;

                  if (i < fullStars) {
                    return <FaStar key={i} />;
                  } else if (i === fullStars && hasHalf) {
                    return <FaStarHalfAlt key={i} />;
                  }
                  return null;
                })}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.rate}
              </span>
              <span className="text-xs text-gray-400">/5</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <FaRegStar className="text-base" />
              <p className="text-xs font-medium">No reviews yet</p>
            </div>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200">
          {/* Price */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>

          <button
            disabled={availableQuantity === 0 || isAddingToCart}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              availableQuantity === 0 || isAddingToCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:scale-95"
            }`}
            onClick={handleCart}
          >
            {isAddingToCart 
              ? "Adding..." 
              : availableQuantity === 0 
              ? "Out of Stock" 
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}