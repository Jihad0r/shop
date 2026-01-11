import { Suspense } from "react";
import ProductDetailSkeleton from "@/app/component/ProductDetailSkeleton";


export default function RootLayout({ children }) {
  return (
      <>
<<<<<<< HEAD
           
              <Suspense fallback={<ProductDetailSkeleton/>}>
                {children}
              </Suspense>
=======
        <Suspense fallback={<ProductDetailSkeleton/>}>
          {children}
        </Suspense>
>>>>>>> 7bb97d6 (fix auth and product bugs)
      </>
  );
}
