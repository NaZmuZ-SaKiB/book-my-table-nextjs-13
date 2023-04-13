export default function Price({ price }) {
  const renderPrice = () => {
    if (price === "CHEAP") {
      return (
        <>
          <span>$$</span> <span className="text-gray-400">$$</span>
        </>
      );
    } else if (price === "REGULAR") {
      return (
        <>
          <span>$$$</span> <span className="text-gray-400">$</span>
        </>
      );
    } else {
      return (
        <>
          <span>$$$$</span>
        </>
      );
    }
  };
  return <p className="flex mr-3">{renderPrice()}</p>;
}
