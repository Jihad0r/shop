"use client"


export default function ProductLoadingCard() {
  return (
    
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg overflow-hidden flex flex-col cursor-pointer relative"
          >
            <div className="bg-gray-300 p-2 rounded-2xl w-full md:min-w-60 h-100 flex items-center justify-center">
              
            </div>
            <div className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 absolute right-1 bottom-1"></div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-10"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-16 mt-3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
}
