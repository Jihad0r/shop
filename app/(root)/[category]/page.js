"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
      <p className="text-center text-2xl font-bold py-20">Loading...</p>
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
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
            onClick={() => router.push(`/product/${product._id}`)}
          >
            <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-60 flex items-center justify-center">
                    <img
                      className="object-contain w-full h-full"
                      
          src={product.image}
          alt={product.title}
                    />
                  </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                {product.rate ? (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">
                      {"★".repeat(product.rate)}
                    </span>
                    <p className="font-semibold">{product.rate}/5</p>
                  </div>
                ) : (
                  <p>No Reviews</p>
                )}
                <p className="font-bold mt-2">${product.price}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-2xl font-bold py-20">No Product</p>
      )}
    </div>
    </div>
  );
}
