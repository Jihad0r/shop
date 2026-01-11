"use client";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import visa from "../../public/images/visa.png";
import meeza from "../../public/images/meeza.png";
import mastercard from "../../public/images/mastercard.png";
import Image from "next/image";

    
export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">SHOP.CO</h3>
          <p className="text-sm mb-6 max-w-md text-gray-600 leading-relaxed">
            We have clothes that suit your style and which you&apos;re proud to wear. From women to men.
          </p>
          <div className="flex gap-3">
            <a 
              href="https://www.linkedin.com/in/jihad-orabi-06b5b42a5/" 
              className="hover:scale-110 transition-transform"
            >
              <FaLinkedin className="p-2 border-2 border-gray-300 hover:border-gray-900 rounded-full w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors" />
            </a>
            <a 
              href="https://github.com/Jihad0r" 
              className="hover:scale-110 transition-transform"
            >
              <FaGithub className="p-2 border-2 border-gray-300 hover:border-gray-900 rounded-full w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors" />
            </a>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl w-full md:w-auto md:min-w-[340px] shadow-xl">
          <h2 className="font-bold text-center uppercase mb-6 text-lg tracking-wide">
            Stay up to date about our latest offers
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center bg-white p-3.5 text-gray-800 rounded-full shadow-md">
              <FiMail className="text-gray-500 mr-3 text-lg" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="outline-none bg-transparent flex-1 text-sm placeholder:text-gray-400"
              />
            </div>
            <button className="bg-white text-black font-semibold cursor-pointer rounded-full p-3.5 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg active:scale-95">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm gap-4">
        <p className="text-gray-500 font-medium">Shop.co © 2025-2026, All Rights Reserved</p>
        <div className="flex gap-3">
          <div className="w-16 h-11 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors shadow-sm">
            <Image src={mastercard} alt="mastercard" className="object-contain w-11 h-9" />
          </div>
          <div className="w-16 h-11 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors shadow-sm">
            <Image src={visa} alt="visa" className="object-contain w-11 h-7" />
          </div>
          <div className="w-16 h-11 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors shadow-sm">
            <Image src={meeza} alt="meeza" className="object-contain w-11 h-9" />
          </div>
        </div>
      </div>
    </footer>
  );
}