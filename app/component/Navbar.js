"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ShoppingBag, User, LogOut, Shield, Home, Shirt, Footprints, Sparkles } from "lucide-react";
import ProductStore from "./ProductStore";

export default function Navbar() {
  const router = useRouter();
  const { user, checkAuth, clearUser, isAdmin } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { searchQuery, setSearchQuery } = ProductStore();

  useEffect(() => {
    if (!user) {
      checkAuth(router);
    }
  }, [user, checkAuth, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (!res.ok) {
        toast.error(data?.error || "Logout failed");
        return;
      }
      toast.success("Logout successful");
      clearUser();
      router.push("/login");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || "Something went wrong");
    }
  };

  const categories = [
    { name: "Home", href: "/" },
    { name: "Shirts", href: "/categories/T-shirts"},
    { name: "Shoes", href: "/categories/shoes"},
    { name: "Coats", href: "/categories/coats"},
    { name: "Shorts", href: "/categories/shorts"},
    { name: "Others", href: "/categories/others" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50  transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-white shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between gap-4 items-center h-16">
            {/* Logo & User Greeting */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 border-2 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-black " />
                </div>
                <span className="text-2xl font-bold">
                  SHOP
                </span>
              </Link>
              {user && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group relative text-gray-700 font-medium hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                );
              })}
              {user && !isAdmin && (
                <Link
                  href="/cart"
                  className="group relative px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              )}
            </div>

            {/* Search Bar (Admin) */}
            {isAdmin && (
              <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Desktop User Controls */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-full transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && isAdmin && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setShowMobileMenu(false)}
          ></div>

          <div className="fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto animate-slide-in">
            <div className="p-6">
              {/* User Info */}
              {user && (
                <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-600">
                        {isAdmin ? "Admin" : "Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group"
                    >
                      <span className="font-medium group-hover:text-indigo-600">
                        {category.name}
                      </span>
                    </Link>
                  );
                })}

                {user && !isAdmin && (
                  <Link
                    href="/cart"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                    <span className="font-medium group-hover:text-indigo-600">
                      Cart
                    </span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all group"
                  >
                    <Shield className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                    <span className="font-medium group-hover:text-indigo-600">
                      Admin Dashboard
                    </span>
                  </Link>
                )}
              </div>

              {/* Auth Actions */}
              <div className="border-t border-gray-200 pt-6">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}