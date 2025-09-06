"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

export default function CartPage() {
  
  const [deleteIcon, setDeleteIcon] = useState(true);
  const [carts, setCarts] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);


  const fetchCart = async () => {
    try {
      const res = await fetch("/api/carts/");
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCarts(data.items || []);
    } catch (err) {
      toast.error(err.error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDeleteItem = async (id) => {
    
    try {
      setDeleteIcon(false)
      const res = await fetch(`/api/carts/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Delete failed");


      await fetchCart();

      toast.success(`Item deleted successfully`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE30") {
      setDiscountRate(0.3);
      toast.success("Promo code applied! 30% discount");
    } else {
      setDiscountRate(0);
      toast.error("Invalid promo code");
    }
  };

  const totalPrice = carts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = totalPrice - totalPrice * discountRate;

  return (
    <div className="p-4">
      <h1 className="p-6 font-bold text-2xl">Cart</h1>
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Cart Items */}
        <div className="w-full md:w-2/3 space-y-4 max-h-[500px] overflow-y-auto pr-2 border border-gray-200 p-4 rounded-2xl">
          {carts.length > 0 ? (
            carts.map((cart) => (
              <div key={cart._id} className="flex justify-between rounded-2xl bg-gray-100 gap-4 relative">
                <div className="flex">
                 <div className="bg-gray-200 p-2 rounded-2xl mr-2 min-w-28 h-28 flex items-center justify-center">
                    <img
                      className="object-contain w-full h-full"
                      src={cart.product.image}
                      alt={cart.product.title}
                    />
                  </div>

                  <div className="flex flex-col gap-2 p-2">
                    <h1 className="text-xl font-bold">{cart.product.title}</h1>
                    <p className="absolute right-1 bottom-1 bg-gray-200 rounded-full px-4 py-2">{cart.quantity}</p>
                    <p className="text-xl font-bold">${cart.price}</p>
                  </div>
                </div>
                {deleteIcon&&
                <MdDeleteForever
                  className="cursor-pointer p-2 text-red-400 text-4xl"
                  onClick={() => handleDeleteItem(cart.product._id)}
                />}
                
              </div>
            ))
          ) : (
            <p className="text-center font-bold text-2xl">No Item</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 p-3 border border-gray-400 rounded-2xl h-fit space-y-4">
          <h1 className="font-bold">Order Summary</h1>
          <div className="flex justify-between">
            <p className="text-gray-500">Subtotal</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Discount</p>
            <p>{(discountRate * 100).toFixed(0)}%</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Shipping</p>
            <p className="text-green-400">Free</p>
          </div>

          {/* Promo Code Input */}
          <div>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="border rounded px-2 py-1 w-full"
            />
            <button
              onClick={applyPromo}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2 w-full"
            >
              Apply Promo
            </button>
          </div>

          <hr className="text-gray-500 my-6" />
          <div className="flex justify-between">
            <p className="text-gray-500">TOTAL</p>
            <p className="font-bold">${discountedTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Estimated delivery by</p>
            <p>1-3 days</p>
          </div>
          <button className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-2xl w-full">
            Go to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
