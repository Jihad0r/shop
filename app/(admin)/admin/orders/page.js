"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Package, Tag } from "lucide-react";

export default function Customers() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/carts");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        console.log(data)
        setCarts(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : carts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-400 mb-2">
            No users yet
          </h3>
          <p className="text-gray-400">Get started by adding your first users</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {carts.map((cart, index) => (
            <li
              key={cart._id || index}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {cart.user?.username}
                  </h2>

                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 font-medium">
                      {cart.items.length}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
