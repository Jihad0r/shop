"use client"
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
<<<<<<< HEAD
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
    
=======
import { Tag, ShoppingCart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useCartStore from "./store/CartStore";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(
    parseInt(product?.inStock) || 0
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  
    const fetchCart = useCartStore((state) => state.fetchCart);
      
  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart || availableQuantity < quantity) return;

    setIsAddingToCart(true);

>>>>>>> 7bb97d6 (fix auth and product bugs)
    try {
      const res = await fetch(`/api/carts/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
<<<<<<< HEAD
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
      
=======
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to add item");
      }

      toast.success(
        `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart successfully!`
      );

      // Update local stock optimistically
      setAvailableQuantity((prev) => Math.max(0, prev - quantity));
      setQuantity(1);
      fetchCart();
      // Optional: Update with actual stock from server response
      if (result.remainingStock !== undefined) {
        setAvailableQuantity(result.remainingStock);
      }
>>>>>>> 7bb97d6 (fix auth and product bugs)
    } catch (err) {
      console.error("Cart error:", err);
      toast.error(err.message || "Error adding to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
<<<<<<< HEAD
=======
    }
  };

  const handleQuantityChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.min(Math.max(1, value), availableQuantity));
  };

  const incrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < availableQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
>>>>>>> 7bb97d6 (fix auth and product bugs)
    }
  };

  return (
    <Link
      href={`/product/${product._id}`}
<<<<<<< HEAD
      className="rounded-lg flex flex-col cursor-pointer relative"
    >
      <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
        <img
          className={`${
            product.category === "shoes" ? "object-contain" : "object-cover"
          } w-full h-full transition-transform duration-300 ease-in-out hover:scale-110`}
=======
      className="rounded-lg flex flex-col cursor-pointer relative group hover:shadow-lg transition-shadow"
    >
      {/* Stock Badge */}
      {availableQuantity <= 5 && availableQuantity > 0 && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          Only {availableQuantity} left
        </div>
      )}
      
      {availableQuantity === 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          Out of Stock
        </div>
      )}

      <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center overflow-hidden">
        <img
          className={`${
            product.category === "shoes" ? "object-contain" : "object-cover"
          } w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110`}
>>>>>>> 7bb97d6 (fix auth and product bugs)
          src={product.image}
          alt={product.title}
        />
      </div>
<<<<<<< HEAD
      
      <div className="pt-4 flex-1 flex flex-col justify-between">
        {/* Category Badge */}
        <div className="flex items-center gap-1.5">
=======

      <div className="pt-4 flex-1 flex flex-col justify-between">
        {/* Category Badge */}
        <div className="flex items-center gap-1.5 mb-2">
>>>>>>> 7bb97d6 (fix auth and product bugs)
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
<<<<<<< HEAD
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
=======
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
>>>>>>> 7bb97d6 (fix auth and product bugs)
          {product.title}
        </h2>

        {/* Rating Section */}
<<<<<<< HEAD
        <div>
=======
        <div className="mb-3">
>>>>>>> 7bb97d6 (fix auth and product bugs)
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

<<<<<<< HEAD
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
=======
        {/* Price Section */}
        <div className="flex items-baseline gap-0.5 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
        </div>

        {/* Quantity Selector */}
        {availableQuantity > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={availableQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= availableQuantity}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          disabled={availableQuantity === 0 || isAddingToCart}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            availableQuantity === 0 || isAddingToCart
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white cursor-pointer hover:bg-gray-800 active:scale-95"
          }`}
          onClick={handleCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : availableQuantity === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
>>>>>>> 7bb97d6 (fix auth and product bugs)
      </div>
    </Link>
  );
}