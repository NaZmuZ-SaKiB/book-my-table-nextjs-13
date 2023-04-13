import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchLocations = async () =>
  await prisma.location.findMany({ select: { name: true } });

const fetchCuisines = async () =>
  await prisma.cuisine.findMany({ select: { name: true } });

const prices = [
  { name: "CHEAP", value: "$" },
  { name: "REGULAR", value: "$$" },
  { name: "EXPENSIVE", value: "$$$" },
];

export default async function SearchSideBar({ searchParams }) {
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <div className="pr-2 w-full">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <Link
            key={location.id + location.name}
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: location.name,
              },
            }}
            className="font-light text-reg capitalize"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: cuisine.name,
              },
            }}
            key={cuisine.id + cuisine.name}
            className="font-light text-reg capitalize"
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex pb-4 border-b">
          {prices.map((price) => (
            <Link
              key={price.value}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price.name,
                },
              }}
              className="border w-full text-reg p-2 font-light rounded text-center"
            >
              {price.value}
            </Link>
          ))}
        </div>
        <Link
          href="/search"
          className="py-2 px-4 text-reg rounded-full bg-red-700 text-white mt-3 inline-block"
        >
          Reset Filters
        </Link>
      </div>
    </div>
  );
}
