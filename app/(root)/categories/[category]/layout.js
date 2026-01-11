import ProductLoadingCard from "@/app/component/ProductLoadingCard";
import { Suspense } from "react";

<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
=======
>>>>>>> 7bb97d6 (fix auth and product bugs)

export default async function RootLayout({ children,params}) {
  
<<<<<<< HEAD
  const { category } =  params;
  return (
      <>
           <div>
             <h1 className="p-6 font-bold text-2xl">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
              <Suspense fallback={<ProductLoadingCard/>}>
                {children}
              </Suspense>
           </div>
           </>
=======
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
>>>>>>> 7bb97d6 (fix auth and product bugs)
  );
}
