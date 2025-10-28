import Image from "next/image";
import modelBackground from "../../public/images/portrait-handsome-smiling-stylish-young-man.png";
import ProductLoadingCard from "../component/ProductLoadingCard"

import ForYou from "../component/getProductes";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
    <section className="relative h-240 lg:h-140 px-6 lg:px-20 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
          <div className="flex flex-col gap-6 mt-5 w-full lg:max-w-xl">
            <h1 className="text-5xl font-extrabold leading-tight">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-gray-500">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full w-fit cursor-pointer">
              Shop Now
            </button>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-2xl font-bold">200+</h3>
                <p className="text-gray-500 text-sm">International Brands</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">2,000+</h3>
                <p className="text-gray-500 text-sm">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">30,000+</h3>
                <p className="text-gray-500 text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="h-[unset] lg:h-170 overflow-hidden rounded-2xl bg-gray-200 z-[-20] relative">
            <Image
              src={modelBackground}
              alt="model"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>
      <div className="bg-black py-4 text-white z-[10] flex flex-wrap justify-around relative">
        <span className="font-bold text-lg">VERSACE</span>
        <span className="font-bold text-lg">ZARA</span>
        <span className="font-bold text-lg">GUCCI</span>
        <span className="font-bold text-lg">PRADA</span>
        <span className="font-bold text-lg">Calvin Klein</span>
      </div>
      <div className="px-6 py-10 z-[20]  bg-white relative">
        <h1 className="text-6xl text-center font-bold mb-6">For You</h1>
        <Suspense fallback={<ProductLoadingCard/>}>
          <ForYou />
        </Suspense>
      </div>
    </>
  );
}

