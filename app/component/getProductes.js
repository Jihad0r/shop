
import Link from "next/link";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default async function ForYou() {
  const baseURL = typeof window === 'undefined' 
  ? 'http://localhost:3000'
  : '';  

const res = await fetch(`${baseURL}/api/products/product`, {
  cache: "no-store",
});
  const products = await res.json();
  console.log(products)
  const randomProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {randomProducts.map((product) => (
          <Link
            href={`/product/${product._id}`}
            key={product._id}
            className="rounded-lg overflow-hidden flex flex-col cursor-pointer relative"
          >
            <div className="bg-gray-200 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
              <img
                className={`${
                  product.category === "shoes" ? "object-contain" : "object-cover"
                } w-full h-full`}
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-nowrap">{product.title}</h2>
                <p
                  className={`font-bold absolute right-1 bottom-1 ${
                    Number(product.inStock) === 0
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {Number(product.inStock) === 0 ? "Out of Stock" : "In Stock"}
                </p>

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

                <p className="font-bold text-2xl mt-2">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

