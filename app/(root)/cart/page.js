"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Tag, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const [deleteIcon, setDeleteIcon] = useState(true);
  const [carts, setCarts] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/carts/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCarts(data.items || []);
    } catch (err) {
       toast.error(err.message || "Error fetching cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      setDeleteIcon(false);
      const res = await fetch(`/api/carts/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Delete failed");

      await fetchCart();
       toast.success("Item removed from cart");
    } catch (err) {
       toast.error(err.message || "Item didn't remove from cart.");
    } finally {
      setDeleteIcon(true);
    }
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === process.env.Discount) {
      setDiscountRate(0.3);
      
      toast.success("Promo code applied! 30% off");
    } else {
      setDiscountRate(0);
      toast.error("Invalid promo code");
    }
  };

  const totalPrice = carts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = totalPrice - totalPrice * discountRate;

  return (
    <div className="min-h-screen ">
      <div className="w-full p-6 lg:p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600">
            {carts.length} {carts.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 ">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {carts.length > 0 ? (
                  carts.map((cart, index) => (
                    <div
                      key={cart._id}
                      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative bg-white rounded-xl p-3 w-28 h-28 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <img
                            className="object-contain w-full h-full"
                            src={cart.product.image}
                            alt={cart.product.title}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
                              {cart.product.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Package className="w-4 h-4" />
                              <span>Qty: {cart.quantity}</span>
                            </div>
                          </div>
                          <div className="flex items-end justify-between mt-2">
                            <p className="text-2xl font-bold text-green-500">
                              ${cart.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        {deleteIcon && (
                          <button
                            onClick={() => handleDeleteItem(cart.product._id)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div key={""} className="text-center py-16">
                    <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                    <p className="text-2xl font-semibold text-gray-400">Your cart is empty</p>
                    <p className="text-gray-400 mt-2">Add items to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</span>
                </div>
                
                {discountRate > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Discount
                    </span>
                    <span className="font-semibold">-${(totalPrice * discountRate).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-500">Free</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <label className="text-sm font-semibold text-gray-700">Promo Code</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Total</span>
                  <span className="text-3xl font-bold text-green-500">
                    ${discountedTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 text-right">Estimated delivery: 1-3 days</p>
              </div>
              {carts.length > 0 &&
              <Link href={"/payment"}><button className="w-full bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Proceed to Checkout
              </button></Link>}
              

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">🔒 Secure checkout guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}