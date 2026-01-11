import { Suspense } from "react";
import ProductDetailSkeleton from "@/app/component/ProductDetailSkeleton";


export default function RootLayout({ children }) {
  return (
      <>
        <Suspense fallback={<ProductDetailSkeleton/>}>
          {children}
        </Suspense>
      </>
  );
}
