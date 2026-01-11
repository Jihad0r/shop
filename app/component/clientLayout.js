"use client";
import { usePathname } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Login from "../component/login";

export default function ClientLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname();
  
  return (
      <div className={showLogin ? "overflow-hidden" : ""}>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar setShowLogin={setShowLogin} />
        {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin} />}
        {children}
        {pathname !== "/signup" && <Footer />}
      </div>
  );
}