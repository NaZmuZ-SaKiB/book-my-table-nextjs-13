import { PrismaClient } from "@prisma/client";

import Header from "../components/Header";
import Form from "../components/Form";

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug) => {
  const jsonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${slug}`,
    { cache: "no-store" }
  );
  const res = await jsonRes.json();

  return res.data;
};

export default async function Reserve({ params, searchParams }) {
  const { date, partySize } = searchParams;
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="pt-3 md:pt-5">
      <div className="py-10 px-2 w-full max-w-screen-md m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={date}
          partySize={partySize}
        />
        <Form slug={params.slug} partySize={partySize} date={date} />
      </div>
    </div>
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
  return { title: `Reserve | ${restaurant.name}` };
}
