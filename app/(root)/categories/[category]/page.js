<<<<<<< HEAD
import ProductCard from "../../../component/getProductes"

async function getProducts(category) {
=======
import ProductCard from "@/app/component/getProductes";

async function getCategory(category) {
>>>>>>> 7bb97d6 (fix auth and product bugs)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${baseUrl}/api/products/${category}`, {
      cache:"no-cache", 
    })
    
    if (!res.ok) {
      throw new Error("Failed to fetch category");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return [];
  }
}

export default async function CategoryPage({params}) {
  const { category } = await params;
  const products = await getCategory(category);
  if (products.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
=======
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
         {products.map((product) => (
          <ProductCard key={product._id} product={product} />
          ))}
      </div>
      </>
>>>>>>> 7bb97d6 (fix auth and product bugs)
  );
}