"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/component/authStore";
import { Eye,EyeOff} from "lucide-react";


export default function CreateAccount() {
  const router = useRouter();
    const { setUser } = useAuthStore();
    const [showPass,setShowPass] = useState({
    password: false,
    confirm_password: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const togglePassword  = (e) => {
    setShowPass((prev) => ({
      ...prev,
      [e]:!prev[e],
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const loadingToast = toast.loading("Signing up...");

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    toast.dismiss(loadingToast);

    if (!res.ok) {
      toast.error(data.error || "Account creation failed");
      return;
    }

    toast.success("Signup successful");
    setUser(data)
    router.push("/");
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error(err.message || "Something went wrong");
  }
};


  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CREATE ACCOUNT
        </h1>
        <p className="text-gray-600">
          Please register below to create an account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            User Name  <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={handleChange}
            value={formData.username}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Your Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type={showPass.password?"text":"password"}
            onChange={handleChange}
            value={formData.password}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
         />
           <button type="button" className="absolute right-5 top-1/2">{showPass.password?<Eye onClick={()=>togglePassword("password")} />: <EyeOff onClick={()=>togglePassword("password")}/>}</button>
        </div>
        <div className="relative">
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type={showPass.confirm_password?"text":"password"}
            onChange={handleChange}
            value={formData.confirm_password}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
              <button  type="button" className="absolute right-5 top-1/2">{showPass.confirm_password?<Eye onClick={()=>togglePassword("confirm_password")} />: <EyeOff onClick={()=>togglePassword("confirm_password")}/>}</button>
       
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 px-4 font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          Create An Account
        </button>
      </form>
    </div>
  );
}