import ReviewCard from "./ReviewCard";

export default function Reviews({ reviews }) {
  return (
    <div>
      <h2 className="font-bold text-2xl md:text-3xl borber-b my-5 md:my-10">
        What 100 people are saying
      </h2>
      <div>
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p>No Reviews!</p>
        )}
      </div>
    </div>
  );
}
