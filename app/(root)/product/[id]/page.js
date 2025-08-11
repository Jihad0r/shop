"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import ReviewModal from "@/app/component/ReviewModal";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("/api/products/product");
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          toast.error(err.message);
        }
      };
      fetchProducts();
    }, [setProducts]);
  
    const randomProducts = useMemo(() => {
      if (!products || products.length === 0) return [];
      return [...products].sort(() => Math.random() - 0.5).slice(0, 4);
    }, [products])

  if (!product) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex w-1/2 bg-gray-200 rounded-2xl gap-4 mb-4">
              <img
              src={product.image}
              alt={product.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">
                  {"★".repeat(product.rate)}</span>
            <p className="font-semibold">{product.rate}/5</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through">${product.oldPrice}</span>
            )}
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
                className="px-3 py-2"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-3 py-2"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Reviews ({product.reviews.length})</h2>
          <span  className="bg-black rounded-2xl text-white font-bold cursor-pointer py-4 px-6"
        onClick={() => setShowReviewModal(true)}>Write a review</span>  
        </div>
        
  {product.reviews && product.reviews.length > 0 ? (
    <div className="grid md:grid-cols-2 gap-6">
    {product.reviews.map((review, i) => (
      <div key={i} className="p-4 border border-gray-200 rounded-lg">
        <p className="text-yellow-400 text-xl">
          {"★".repeat(review.rating)}
        </p>
        <p className="font-semibold">
          {review.user?.username || `User ${i + 1}`}
        </p>
        <p className="text-gray-600 text-sm">{review.comment}</p>
        <p className="text-gray-400 text-xs mt-2">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
      
    ))}</div>
  ) : (
    <h1 className="text-center font-bold text-2xl">No Reviews</h1>
  )}


      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-center font-bold m-10 p-10 text-6xl">You Might Also Like</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {randomProducts.map((product) => (
             <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
              onClick={() => router.push(`/product/${product._id}`)}
            >
              <div className="bg-gray-200 rounded-2xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-70 m-auto object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  {product.rate? <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">
                  {"★".repeat(product.rate)}</span>
            <p className="font-semibold">{product.rate}/5</p>
          </div>:<p>No Reviews</p>}
                  <p className="font-bold mt-2">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showReviewModal && (
        <ReviewModal
          productId={id}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={(newReview) => setReviews([...reviews, newReview])}
        />
      )}
    </div>
  );
}
