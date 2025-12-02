"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "./authStore";
import { X } from "lucide-react";
import Link from "next/link";

export default function Login({setShowLogin, showLogin}) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (showLogin) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowLogin(!showLogin);
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Login successful");
      setUser(data.user);
      handleClose();
      router.push("/");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSignupClick = () => {
    handleClose();
    router.push("/signup");
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`bg-black/30 absolute inset-0 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>
      
      {/* Sliding Panel */}
      <div className={`w-3/4 md:w-2/4 lg:w-1/4 text-gray-700 bg-white p-6 absolute bottom-0 right-0 top-0 shadow-2xl transition-transform duration-300 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <X 
            className="w-6 h-6 cursor-pointer hover:text-gray-600" 
            onClick={handleClose} 
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-2 border outline-none rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            className="w-full p-2 m-0 border outline-none rounded"
          />
          <Link href={"/resetPass"}>Forget Password?</Link>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 hover:bg-gray-800 cursor-pointer rounded"
          >
            Login
          </button>
        </form>
        
        <button
          onClick={handleSignupClick}
          className="w-full bg-black text-white p-2 hover:bg-gray-800 cursor-pointer rounded mt-4"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}