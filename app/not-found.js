import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <div className="h-1 w-20 bg-gray-800 mx-auto mt-4"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <FaHome />
            Go Home
          </Link>
          
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaSearch />
            Search Products
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">Popular Categories:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            <Link href="/category/electronics" className="text-sm text-blue-600 hover:underline">
              Electronics
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/category/clothing" className="text-sm text-blue-600 hover:underline">
              Clothing
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/category/shoes" className="text-sm text-blue-600 hover:underline">
              Shoes
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/category/accessories" className="text-sm text-blue-600 hover:underline">
              Accessories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}