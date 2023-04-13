export default function Header({ name }) {
  const renderTitle = () => {
    const nameArray = name.split("-");
    nameArray[nameArray.length - 1] = `(${nameArray[nameArray.length - 1]})`;

    return nameArray.join(" ");
  };

  return (
    <div className="overflow-hidden">
      <div className="bg-center py-16 md:py-24 lg:py-28 bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl 2xl:text-7xl text-white capitalize text-shadow text-center">
          {renderTitle()}
        </h1>
      </div>
    </div>
  );
}
