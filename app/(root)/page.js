"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import ProductStore from "../component/ProductStore";
import modelBackground from "../../public/images/portrait-handsome-smiling-stylish-young-man.png";
import toast from "react-hot-toast";

export default function Home() {
  const { products, setProducts } = ProductStore();
  const router = useRouter();

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
    return [...products].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [products]);

  return (
    <>
    <section className="relative h-240 lg:h-140 px-6 lg:px-20 py-16">
        {/* Content Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
          <div className="flex flex-col gap-6 mt-5 w-full lg:max-w-xl">
            <h1 className="text-5xl font-extrabold leading-tight">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-gray-500">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full w-fit cursor-pointer">
              Shop Now
            </button>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-2xl font-bold">200+</h3>
                <p className="text-gray-500 text-sm">International Brands</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">2,000+</h3>
                <p className="text-gray-500 text-sm">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">30,000+</h3>
                <p className="text-gray-500 text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="h-[unset] lg:h-170 overflow-hidden rounded-2xl bg-gray-200 z-[-20] relative">
            <Image
              src={modelBackground}
              alt="model"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Brands Row */}
      <div className="bg-black py-4 text-white z-[100] flex justify-around relative">
        <span className="font-bold text-lg">VERSACE</span>
        <span className="font-bold text-lg">ZARA</span>
        <span className="font-bold text-lg">GUCCI</span>
        <span className="font-bold text-lg">PRADA</span>
        <span className="font-bold text-lg">Calvin Klein</span>
      </div>

      <div className="px-6 py-10 bg-white z-[100] relative">
        <h1 className="text-6xl text-center font-bold mb-6">for You</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
         {randomProducts ? (
  randomProducts.map((product) => (
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
  <p className="text-center text-2xl font-bold py-20">Loading...</p>
)}

        </div>
      </div>
    </>
  );
}

