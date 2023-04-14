import { PrismaClient } from "@prisma/client";

import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug) => {
  const jsonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${slug}/menu`,
    { cache: "no-store" }
  );
  const res = await jsonRes.json();

  return res?.data;
};

export default async function RestaurantMenu({ params }) {
  const menu = await fetchRestaurantMenu(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <Menu menu={menu} />
      </div>
    </>
  );
}

export const dynamicParams = false; // true | false,

export async function generateStaticParams() {
  const restaurants = await prisma.restaurant.findMany({
    select: { slug: true },
  });

  return restaurants.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}

export async function generateMetadata({ params }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });
  return { title: `Menu | ${restaurant.name}` };
}
