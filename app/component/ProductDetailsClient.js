"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import ReviewModal from "@/app/component/ReviewModal";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ProductCard from "./getProductes";

export default function ProductDetailsClient({ product: initialProduct, randomProducts }) {
<<<<<<< HEAD
=======
  const router = useRouter();
  console.log(initialProduct);
>>>>>>> 7bb97d6 (fix auth and product bugs)
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(initialProduct.inStock);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState(initialProduct.reviews || []);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleCart = async (id) => {
    // Prevent double-clicking
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      const res = await fetch(`/api/carts/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include", // Important for cookies
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result?.error || "Failed to add item");
      }
      
      // Success message
      toast.success(
        `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart successfully!`
      );
      
      // Update available quantity
      setAvailableQuantity((prev) => Math.max(0, prev - quantity));
      
      // Reset quantity to 1 after adding
      setQuantity(1);
      
    } catch (err) {
      console.error("Cart error:", err);
      toast.error(err.message || "Error adding to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex w-full md:w-1/2 bg-gray-200 rounded-2xl gap-4 mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[400px] object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-150"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          
          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            {availableQuantity > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-600 font-semibold">
                  {availableQuantity} available
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 font-semibold">Out of stock</p>
              </>
            )}
          </div>

          {product.rate ? (
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-xl">
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
              <p className="font-semibold">{product.rate}/5</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <FaRegStar className="text-xl" />
              <p className="text-sm">No reviews yet</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discount && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm">
                -{product.discount}%
              </span>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center border rounded-lg">
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={availableQuantity === 0 || isAddingToCart}
              >
                -
              </button>
              <span className="px-4 min-w-[40px] text-center">{quantity}</span>
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={() =>
                  setQuantity((q) => Math.min(availableQuantity, q + 1))
                }
                disabled={availableQuantity === 0 || isAddingToCart}
              >
                +
              </button>
            </div>
            <button
              disabled={availableQuantity === 0 || isAddingToCart}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                availableQuantity === 0 || isAddingToCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 active:scale-95"
              }`}
              onClick={() => handleCart(product._id)}
            >
              {isAddingToCart 
                ? "Adding..." 
                : availableQuantity === 0 
                ? "Out of Stock" 
                : "Add to Cart"}
            </button>
          </div>

          {/* Guest info message */}
          <p className="text-sm text-gray-500 mt-2">
            💡 You can add items to cart without an account. Your cart will be saved when you sign up!
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Reviews ({reviews.length})</h2>
          <span
            className="bg-black rounded-2xl text-white font-bold cursor-pointer py-4 px-6 hover:bg-gray-800 transition-colors"
            onClick={() => setShowReviewModal(true)}
          >
            Write a review
          </span>
        </div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-yellow-400 text-xl">
                  {"★".repeat(review.rating)}
                </p>
                <p className="font-semibold">
                  {review?.user?.username || `User ${i + 1}`}
                </p>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-center font-bold text-2xl">No Reviews</h1>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-center font-bold m-10 p-10 text-xl md:text-2xl lg:text-6xl">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
<<<<<<< HEAD
          {randomProducts.length > 0 ? (
            randomProducts.map((product) => (
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
            ))
          ) : (
            <p className="text-center text-2xl font-bold py-20">Loading...</p>
          )}
=======
          {randomProducts.map((product) => (
             <ProductCard key={product._id} product={product} />
            ))}
>>>>>>> 7bb97d6 (fix auth and product bugs)
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          productId={product._id}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={(newReview) => {
            setReviews((prev) => [...prev, newReview]);
            setProduct((prev) => ({
              ...prev,
              reviews: [...prev.reviews, newReview],
              rate:
                (prev.reviews.reduce((acc, r) => acc + r.rating, 0) +
                  newReview.rating) /
                (prev.reviews.length + 1),
            }));
          }}
        />
      )}
    </div>
  );
}