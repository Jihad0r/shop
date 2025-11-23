"use client";
import { Sidebar } from "./component/sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/component/authStore";

 

export default function RootLayout({ children }) {
   const { isAdmin, loading } = useAuthStore(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);


  return (
    <>
        
         {!loading || isAdmin? (<div className="flex justify-end">
        <Sidebar/>
        <div className="min-h-screen w-full md:w-3/4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">{children}</div>
        </div>):(<div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Checking permissions...
      </div>)}
        </>
  );
}