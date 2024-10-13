"use client";
import { useState } from "react";

interface StarRatingProps {
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  totalStars = 5,
  onRatingChange,
}: StarRatingProps) {
  const [rating, setRating] = useState(0);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            filled={starValue <= rating}
            onClick={() => handleRating(starValue)}
          />
        );
      })}
    </div>
  );
}

function Star({ filled, onClick }: { filled: boolean; onClick: () => void }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "gold" : "gray"}
      className="w-6 h-6 cursor-pointer"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
