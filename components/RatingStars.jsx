export default function RatingStars({ avgRating }) {
  const percentage = ((avgRating * 100) / 5).toFixed(2);
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(90deg, #FDAF07  ${percentage}%, #D8D9DB  ${percentage}%)`,
        display: "flex",
      }}
    >
      <img className="inline-block w-full" src="/full-star.png" alt="" />
    </div>
  );
}
