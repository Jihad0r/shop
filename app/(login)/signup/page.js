"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "../../component/authStore";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);

    const loadingToast = toast.loading("Signing up...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Signup successful");

      setUser(data.user);
      router.push("/");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-[80%] md:max-w-md background text-gray-700 m-auto mt-30 p-6 border border-blue-200 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-2xl outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-2xl outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-2xl outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700 cursor-pointer"
        >
          Signup
        </button>
        
        <p>I have an account<Link className="ml-2 font-bold" href="/login">Login</Link></p>
      </form>
    </div>
  );
}
