export  default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
}
