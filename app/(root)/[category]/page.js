"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Home() {
  const { category } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]); // array

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/${category}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error(err.error);
      }
    };

    if (category) fetchProducts();
  }, [category]);

  // Loading state
  if (products.length === 0) {
    return (
      <div className="min-h-100">
      <p className="text-center text-2xl font-bold py-20">Loading...</p></div>
    );
  }

  return (
    <div>
      <h1 className="p-6 font-bold text-2xl">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
    <div className="grid grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-4 gap-6 p-6">
      {products.length > 0 ? (
        products.map((product) => (
              <div
                key={product._id}
                className="rounded-lg overflow-hidden flex flex-col cursor-pointer relative"
                onClick={() => router.push(`/product/${product._id}`)}
              >
            
                  <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
                          <img
                                className={`${product.category ==="shoes"?"object-contain":"object-cover"} w-full h-full`}
                                
                    src={product.image}
                    alt={product.title}
                              />
                            </div>
                <div className="pt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-nowrap">{product.title}</h2>
                   
                <p className={`font-bold absolute right-1 bottom-1  ${Number(product.inStock) === 0 ? "text-red-400" : "text-green-400"}`}>{Number(product.inStock) === 0 ? "Out of Stock" : "In Stock"}</p>
                   
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
                <FaRegStar  className="text-xl" />
              <p className="text-sm">No reviews yet</p>
            </div>
          )}
          
                    <p className="font-bold text-2xl mt-2">${product.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-2xl font-bold py-20">Loading...</p>
          )}
    </div>
    </div>
  );
}
