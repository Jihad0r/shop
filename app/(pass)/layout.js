"use client";
import Navbar from "../component/Navbar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Login from "../component/login";

export default function RootLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar setShowLogin={setShowLogin}/>
        {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin}/>}
        {children}
    </>
  );
}