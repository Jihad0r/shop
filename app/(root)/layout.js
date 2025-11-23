"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { usePathname } from 'next/navigation'
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Login from "../component/login";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const pathname = usePathname()

  return (
    <html lang="en">
      <body
        className={`${showLogin && "overflow-hidden "}${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar setShowLogin={setShowLogin}/>
        {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin}/>}
        {children}
        {pathname !== "/signup" || pathname !== "/admin" && <Footer/>}
      </body>
    </html>
  );
}