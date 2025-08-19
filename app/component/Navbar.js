"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMenu, FiX } from "react-icons/fi"; // search + hamburger + close icons
import ProductStore from "./ProductStore";

export default function Navbar() {
  const router = useRouter();
  const { user, checkAuth, clearUser, isAdmin } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
  } = ProductStore();

  useEffect(() => {
    if (!user) {
      checkAuth(router);
    }
  }, [user, checkAuth, router]);

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

  return (
    <nav className="h-fit bg-white px-2 shadow-md w-full">
      {/* Top bar */}
      <div className="flex justify-around items-center">
        {/* Logo + Hello */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold">
            SHOP
          </Link>
          {user && <span className="text-sm text-gray-600">Hello {user.username}</span>}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 justify-between">
          {/* Nav Links */}
          <ul className="flex gap-2 text-gray-700"> 
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/">Home</Link></li>
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/T-shirts">Shirts</Link></li>
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/shoes">Shoses</Link></li>
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/coats">Coats</Link></li>
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/shorts">Shorts</Link></li>
            <li className=" hover:bg-blue-400 py-4 px-1 hover:text-white  cursor-pointer traslation" ><Link href="/others">Others</Link></li>
            {user && !isAdmin &&<li className=" hover:bg-blue-400 py-4 px-1 hover:text-white cursor-pointer  traslation" ><Link  href="/cart">Cart</Link></li>}
            
          </ul>

          {/* Search input */}
          {isAdmin &&
          <div className="border-2 border-gray-300 w-2/3 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none px-3 rounded w-full"
            />
          </div>}

          {/* User controls */}
          <div className="flex items-center gap-2">
            {isAdmin && <Link className="text-blue-600" href="/admin">Admin</Link>}

            {user ? (<button onClick={handleLogout} className="text-red-500 cursor-pointer hover:underline">Logout</button>
               
            ) : (
              <Link href="/login" className="text-green-600 font-semibold">Login</Link>
            )}
          </div>
          </div>

        {/* Mobile icons */}
        <div className="flex md:hidden items-center gap-4">
          {/* Search icon */}
          {isAdmin &&
          <FiSearch
            className="text-xl cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />}

          {/* Hamburger menu */}
          {showMobileMenu ? (
            <FiX
              className="text-6xl py-5 cursor-pointer"
              onClick={() => setShowMobileMenu(false)}
            />
          ) : (
            <FiMenu
              className="text-6xl py-5  cursor-pointer"
              onClick={() => setShowMobileMenu(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden md:-top-100 top-12 z-200  absolute bg-white shadow-md w-full mt-4  flex flex-col gap-3 text-sm text-gray-700 p-4">
          <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border outline-none px-3 py-2 rounded-full w-full"
            />
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden md:-top-100 top-12 left-0  z-200 absolute bg-white shadow-md w-full mt-4  flex flex-col gap-3 text-sm text-gray-700 p-3">
          <div className="flex flex-row-reverse items-center justify-between">{user ? (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="text-red-500 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setShowMobileMenu(false)} className="text-green-600">Login</Link>
          )}</div>
          <Link className="hover:bg-blue-200 p-2   traslation" href="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
          <Link className="hover:bg-blue-200 p-2   traslation"onClick={() => setShowMobileMenu(false)}href="/T-shirts">Shirts</Link>
          <Link className="hover:bg-blue-200 p-2  traslation" onClick={() => setShowMobileMenu(false)}href="/coats">Coats</Link>
          <Link className="hover:bg-blue-200 p-2  traslation"href="/shorts" onClick={() => setShowMobileMenu(false)}>Shorts </Link>
          
          <Link className="hover:bg-blue-200 p-2   traslation" onClick={() => setShowMobileMenu(false)} href="/shoes">Shoses</Link>
          
          <Link className="hover:bg-blue-200 p-2  traslation" onClick={() => setShowMobileMenu(false)}href="/others">Others</Link>
          {isAdmin ? (
            <Link className="hover:bg-blue-200 p-2  traslation" href="/admin" onClick={() => setShowMobileMenu(false)}>Admin Dashboard</Link>
          ) : (
            <Link className="hover:bg-blue-200 p-2 traslation" href="/cart" onClick={() => setShowMobileMenu(false)}>Cart</Link>
          )}
        </div>
      )}
    </nav>
  );
}
