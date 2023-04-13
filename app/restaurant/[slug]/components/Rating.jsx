import RatingStars from "@/components/RatingStars";
import getEvgRatting from "@/utils/avgRating";

export default function Rating({ reviews }) {
  const avgRating = getEvgRatting(reviews);
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <RatingStars avgRating={avgRating} />
        <p className="text-reg ml-3">{avgRating.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-reg ml-4">
          {reviews.length} Review{reviews.length > 1 && "s"}
        </p>
      </div>
    </div>
  );
}
