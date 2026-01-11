import ProductCard from "./getProductes";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${baseUrl}/api/products/product`, {
<<<<<<< HEAD
      cache: 'no-store', 
=======
      cache:"no-cache", 
>>>>>>> 7bb97d6 (fix auth and product bugs)
    })
    
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    
<<<<<<< HEAD
    return await res.json();
=======
    const data = await res.json(); 
    return data;
>>>>>>> 7bb97d6 (fix auth and product bugs)
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ForYou() {
  const products = await getProducts();
  
  const seed = new Date().toDateString();
  const seededRandom = (seed) => {
    let x = 0;
    for (let i = 0; i < seed.length; i++) {
      x += seed.charCodeAt(i);
    }
    return () => {
      x = Math.sin(x++) * 10000;
      return x - Math.floor(x);
    };
  };

  const random = seededRandom(seed);
  const randomProducts = [...products]
    .sort(() => random() - 0.5)
    .slice(0, 8);

<<<<<<< HEAD
=======
    console.log(randomProducts);
    
>>>>>>> 7bb97d6 (fix auth and product bugs)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {randomProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}