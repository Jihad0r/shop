"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "../../component/authStore";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      router.push("/");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md background text-gray-700 mx-auto mt-30 p-6 border border-blue-200 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          className="w-full p-2 border rounded-2xl outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full p-2 border rounded-2xl outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700 cursor-pointer"
        >
          Login
        </button>
        <p>I don't have an account<Link className="ml-2 font-bold"  href="/signup">Signup</Link></p>
      </form>
    </div>
  );
}
