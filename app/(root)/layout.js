import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
<<<<<<< HEAD
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import Login from "../component/login";
=======
import ClientLayout from "../component/clientLayout";
>>>>>>> 7bb97d6 (fix auth and product bugs)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
<<<<<<< HEAD
  const [showLogin, setShowLogin] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${showLogin && "overflow-hidden "}${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar setShowLogin={setShowLogin}/>
        {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin}/>}
        {children}
         <Footer/>
=======
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
>>>>>>> 7bb97d6 (fix auth and product bugs)
      </body>
    </html>
  );
}