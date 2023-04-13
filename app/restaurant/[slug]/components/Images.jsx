export default function Images({ images }) {
  return (
    <div>
      <h2 className="font-bold text-2xl md:text-3xl mt-10 mb-7 border-b pb-5">
        5 photo{images.length > 1 ? "s" : ""}
      </h2>
      <div className="flex flex-wrap">
        {images.map((image, i) => (
          <img
            key={i + Math.random()}
            className="w-45 md:w-56 h-44 mr-1 mb-1"
            src={image}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
