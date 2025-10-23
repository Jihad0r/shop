export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
      <div className="flex flex-col md:flex-row gap-10 animate-pulse">
        {/* Product Image Skeleton */}
        <div className="flex w-full md:w-1/2 bg-gray-200 rounded-2xl gap-4 mb-4 h-[400px]">
          <div className="w-full h-full bg-gray-300 rounded-lg"></div>
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Title */}
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          
          {/* Available quantity */}
          <div className="h-5 bg-gray-300 rounded w-32"></div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-5 bg-gray-300 rounded w-12"></div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-4 mt-4">
            <div className="h-12 bg-gray-300 rounded-lg w-32"></div>
            <div className="h-12 bg-gray-300 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}