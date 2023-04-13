import Header from "@/components/Header";
import RestaurantCard from "@/components/RestaurantCard";

const fetchRestaurants = async () => {
  // eslint-disable-next-line no-undef
  const jsonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant`,
    {
      next: { revalidate: 60 },
    }
  );
  const res = await jsonRes.json();
  if (res.status === "success") {
    return res.data;
  } else {
    return [];
  }
};

export default async function Home() {
  const restaurants = await fetchRestaurants();
  return (
    <main>
      <Header />
      {/* CARDS */}
      <div className="py-3 px-2 mt-5 lg:w-[900px] lg:mx-auto flex flex-wrap justify-center">
        {restaurants.length ? (
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
