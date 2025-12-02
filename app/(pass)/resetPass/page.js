"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
    
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    setIsLoading(true);

    const loadingToast = toast.loading("Sending reset link...");

    try {
      const response = await fetch('/api/users/forgetPass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      toast.dismiss(loadingToast);
      
      if (!response.ok) {
        toast.error(data.error || "Failed to send reset link");
        return;
      }
      
      toast.success("Check your email for reset link!");
      setEmail("");
         
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
      </div>

      <form onSubmit={handleForgotPassword}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
        </div>
        
        <button 
          type="submit"  // ✅ Change onClick to type="submit"
          disabled={isLoading}
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}