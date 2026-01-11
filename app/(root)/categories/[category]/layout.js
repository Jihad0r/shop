import ProductLoadingCard from "@/app/component/ProductLoadingCard";
import { Suspense } from "react";


export default async function RootLayout({ children,params}) {
  
  const { category } = await params;
  return (
    <>
      <div>
        <h1 className="p-6 font-bold text-2xl">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        <Suspense fallback={<ProductLoadingCard/>}>
          {children}
        </Suspense>
      </div>
    </>
  );
}
