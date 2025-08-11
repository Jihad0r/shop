"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import payment1 from "../../public/images/Badge.png"
import payment2 from "../../public/images/Badge-1.png"
import payment3 from "../../public/images/Badge-2.png"
import payment4 from "../../public/images/Badge-3.png"
import payment5 from "../../public/images/Badge-4.png"
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">SHOP.CO</h3>
          <p className="text-sm mb-4">
            We have clothes that suit your style and which you&apos;re proud to wear. From women to men.
          </p>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com/in/jihad-orabi-06b5b42a5/"><FaLinkedin className="p-2 border rounded-full w-9 h-9" /></a>
            <a href="https://github.com/Jihad0r"><FaGithub className="p-2 border rounded-full w-9 h-9" /></a>
          </div>
        </div>
        <div className="bg-black text-white p-8 rounded-2xl max-w-6xl mx-auto gap-4">
        <h2 className="text-2xl font-bold text-center md:text-left uppercase">
          Stay up to date about our latest offers
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white text-gray-800 rounded-full px-4 py-2 w-full sm:w-72">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          <button className="bg-white text-black font-semibold cursor-pointer rounded-full px-6 py-2 hover:bg-gray-200 transition">
            Subscribe to Newsletter
          </button>
        </div>
      </div>
        </div>
      <div className="max-w-6xl mx-auto px-6 py-4 border-t flex flex-col md:flex-row items-center justify-between text-sm">
        <p>Shop.co © 2025-2026, All Rights Jihad</p>
        <div className="flex gap-3 mt-2 md:mt-0">
          <Image src={payment1} alt="Visa" className="cursor-pointer" width={40} height={24} />
          <Image src={payment2} alt="MasterCard" className="cursor-pointer" width={40} height={24} />
          <Image src={payment3} alt="PayPal" className="cursor-pointer" width={40} height={24} />
          <Image src={payment4} alt="Apple Pay" className="cursor-pointer" width={40} height={24} />
          <Image src={payment5} alt="Google Pay" className="cursor-pointer" width={40} height={24} />
        </div>
      </div>
    </footer>
  );
}
