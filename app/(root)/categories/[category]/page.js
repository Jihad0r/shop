import ProductCard from "../../../component/getProductes"

async function getProducts(category) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${baseUrl}/api/products/${category}`, {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}