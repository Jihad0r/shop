"use client";
import { Suspense } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ProductDetailSkeleton from "@/app/component/ProductDetailSkeleton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
      <>
           
              <Suspense fallback={<ProductDetailSkeleton/>}>
                {children}
              </Suspense>
      </>
  );
}
