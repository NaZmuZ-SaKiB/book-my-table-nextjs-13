export default function Header({ image, name, date, partySize }) {
  const [day, time] = date.split("T");
  let displayDay = new Date(day).toDateString().split(" ").slice(0, -1);

  displayDay[0] += ",";
  displayDay = displayDay.join(" ");

  return (
    <div>
      <h3 className="font-bold">{"You're almost done!"}</h3>
      <div className="mt-5 flex items-center">
        <img
          src={image}
          alt=""
          className="w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 object-cover rounded"
        />
        <div className="ml-2 sm:ml-4">
          <h1 className="text-lg sm:text-3xl font-medium sm:font-bold">
            {name}
          </h1>
          <div className="flex mt-3 text-reg sm:text-lg">
            <p className="mr-6">{displayDay}</p>
            <p className="mr-6">
              {partySize} {parseInt(partySize) === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
