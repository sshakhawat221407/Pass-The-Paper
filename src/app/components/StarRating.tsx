import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
}

export function StarRating({ rating, onRatingChange, interactive = false, size = 18 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange?.(star)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={size}
            fill={star <= rating ? '#E56E20' : 'none'}
            color={star <= rating ? '#E56E20' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  );
}
