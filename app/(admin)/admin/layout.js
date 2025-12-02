"use client";
import { Sidebar } from "./component/sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/component/authStore";
import Navbar from "@/app/component/Navbar";
import Login from "@/app/component/login";
import { Toaster } from "react-hot-toast";

 

export default function RootLayout({ children }) {
   const { isAdmin, loading } = useAuthStore(); 
   
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);


  return (
    <>
    
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar setShowLogin={setShowLogin}/>
        {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin}/>}
        
         {!loading || isAdmin? (

          <div className="flex justify-end relative">
          
        <Sidebar/>
        <div className="min-h-screen w-full md:w-3/4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">{children}</div>
        </div>):(<div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Checking permissions...
      </div>)}
        </>
  );
}