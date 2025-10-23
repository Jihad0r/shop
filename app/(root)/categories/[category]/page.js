import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { DollarSign, Tag, AlertCircle, CheckCircle } from "lucide-react";

async function getProducts(category) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${category}`, {
      cache: 'no-store', 
    })
    
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { category } = params;
  const products = await getProducts(category);

  if (products.length === 0) {
    return (
      <div className="p-6">
        <h1 className="font-bold text-2xl mb-4">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
           <Link
            href={`/product/${product._id}`}
            key={product._id}
            className="rounded-lg flex flex-col cursor-pointer relative"
          >
            <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
              <img
                className={`${
                  product.category === "shoes" ? "object-contain" : "object-cover"
                } w-full h-full  transition-transform duration-300 ease-in-out  hover:scale-150`}
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className="pt-4 flex-1 flex flex-col justify-between">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h2>
                    <div className="flex items-center justify-between ">
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
                <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">
                        {product.category}
                      </span>
                    </div>
                    </div>

                
                  <div className="absolute top-3 right-3">
                    {Number(product.inStock) === 0 ? (
                      <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        <AlertCircle className="w-3 h-3" />
                        Out of Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                        In Stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}
                    </span>
                  </div>
            </div>
          </Link>
        ))}
      </div>
      </>
  );
}