"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import useAuthStore from "../component/authStore";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const {isAdmin } = useAuthStore();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar/> 
        {children}
         {!isAdmin&&<Footer/>}
      </body>
    </html>
  );
}
