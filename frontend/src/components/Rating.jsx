import React, { useState } from "react";
import { Star } from "lucide-react";

const Rating = ({ value, onChange, readonly = false, size = 20 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors ${
            star <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${readonly ? "cursor-default" : ""}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
};

export default Rating;
