import { PrismaClient } from "@prisma/client";

import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";

export const metadata = {
  title: "Search | BookMyTable",
};

const prisma = new PrismaClient();

const fetchRestaurantsByQuery = async (searchParams) => {
  const where = {};

  if (searchParams.city) {
    const location = {
      name: { equals: searchParams.city.toLowerCase() },
    };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: { equals: searchParams.cuisine.toLowerCase() },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    reviews: true,
    slug: true,
  };

  if (!searchParams) return await prisma.restaurant.findMany({ select });

  const restaurants = await prisma.restaurant.findMany({
    where,
    select,
  });

  return restaurants;
};

export default async function Search({ searchParams }) {
  const restaurants = await fetchRestaurantsByQuery(searchParams);
  return (
    <div className="pt-8 sm:pt-10 md:pt-12">
      <Header />
      <div className="md:flex pt-2 pb-4 px-2 m-auto w-full md:max-w-screen-md justify-between items-start relative">
        <label className="md:hidden" htmlFor="filter-toggle">
          <p className="px-4 py-1 my-2 inline-block text-sm rounded border cursor-pointer font-medium">
            Filters
          </p>
        </label>
        <input hidden type="checkbox" id="filter-toggle" />

        <div className="absolute z-50 top-0 border-r -left-[100%] md:static  pt-2 bg-white w-[90%] max-w-[250px] h-full  transition-all">
          <SearchSideBar searchParams={searchParams} />
          <label
            className="absolute md:hidden right-2 top-1"
            htmlFor="filter-toggle"
          >
            <p className=" inline-block  font-medium cursor-pointer ">Close</p>
          </label>
        </div>

        <div className="w-full">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>No restaurant found :(</p>
          )}
        </div>
      </div>
    </div>
  );
}
