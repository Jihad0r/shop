"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReviewModal({ productId, onClose, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);



  const submitReview = async () => {
  if (!rating) {
    toast.error("Please select a rating");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);

    const res = await fetch(`/api/products/reviews/${productId}`, {
      method: "POST",
      body: formData, // no headers here, browser sets them automatically
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      let message = "Something went wrong";
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        message = errorData?.message || message;
      } else {
        message = await res.text();
      }
      throw new Error(message);
    }

    const data = await res.json();
    onReviewAdded(data);
    toast.success("Review submitted successfully!");
    onClose();
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-[#000000ba]  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Write a Review</h2>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={isFilled ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
              >
                ★
              </button>
            );
          })}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border rounded-lg p-2 mb-4"
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={submitReview}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
