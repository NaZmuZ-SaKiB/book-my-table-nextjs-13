import Header from "@/components/Header";
import RestaurantCard from "@/components/RestaurantCard";

const fetchRestaurants = async () => {
  const jsonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant`,
    {
      cache: "no-store",
    }
  );
  const res = await jsonRes.json();
  return res.data;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();
  return (
    <main>
      <Header />
      {/* CARDS */}
      <div className="py-3 px-2 mt-5 lg:w-[900px] lg:mx-auto flex flex-wrap justify-center">
        {restaurants ? (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))
        ) : (
          <h2 className="text-center font-medium text-2xl">
            No Restaurants Found!
          </h2>
        )}
      </div>
      {/* CARDS */}
    </main>
  );
}
