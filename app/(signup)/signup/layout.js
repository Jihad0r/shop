"use client";
import Navbar from "../../../app/component/Navbar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Login from "../../../app/component/login";

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