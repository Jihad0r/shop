import { notFound } from "next/navigation";
import ProductDetailsClient from "../../../component/ProductDetailsClient.js";

async function getProduct(id) {
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${baseUrl}/api/products/product/${id}`, {
      cache:"no-cache",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

async function getProducts() {
  
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${baseUrl}/api/products/product`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

export default async function ProductDetails({ params }) {
  // Defensive check
   const { id } = await params;

  if (!params || !id) {
    console.error('params or params.id is undefined:', params);
    notFound();
  }

 

  const [product, allProducts] = await Promise.all([
    getProduct(id),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const randomProducts = allProducts.length > 0
    ? [...allProducts].sort(() => Math.random() - 0.5).slice(0, 4)
    : [];

  return (
    <ProductDetailsClient
      product={product}
      randomProducts={randomProducts}
    />
  );
}
