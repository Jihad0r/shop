"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyFailed() {
  const params = useSearchParams();
  const reason = params.get("reason");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-2xl text-center w-80">
        <h1 className="text-xl font-bold text-red-500 mb-3">Email Verification Failed</h1>
        {reason === "expired" ? (
          <p className="text-gray-700 mb-4">Your verification link has expired.</p>
        ) : (
          <p className="text-gray-700 mb-4">Invalid or broken verification link.</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="border w-full p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleResend}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Resend Verification Email
        </button>

        {message && <p className="text-sm text-green-600 mt-3">{message}</p>}
      </div>
    </div>
  );
}
