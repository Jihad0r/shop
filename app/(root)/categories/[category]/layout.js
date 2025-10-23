"use client";
import ProductLoadingCard from "@/app/component/ProductLoadingCard";
import { Suspense } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children,params }) {
  
  const { category } = params;
  return (
      <>
           <Toaster position="top-center" reverseOrder={false} />
           <div>
             <h1 className="p-6 font-bold text-2xl">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
              <Suspense fallback={<ProductLoadingCard/>}>
                {children}
              </Suspense>
           </div>
           </>
  );
}
