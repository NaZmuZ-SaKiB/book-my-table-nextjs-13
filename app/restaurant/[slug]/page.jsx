import { PrismaClient } from "@prisma/client";

import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import AddReview from "./components/AddReview";

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug) => {
  const jsonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${slug}`,
    {
      cache: "no-store",
    }
  );
  const res = await jsonRes.json();
  return res.data;
};

export default async function RestaurantDetails({ params }) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <>
      <div className="bg-white w-full lg:w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <div className="mt-3 lg:hidden">
          <ReservationCard
            openTime={restaurant.open_time}
            closeTime={restaurant.close_time}
            slug={params.slug}
          />
        </div>
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
        <AddReview id={restaurant.id} />
      </div>
      <div className="hidden lg:block w-[27%] text-reg">
        <ReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={params.slug}
        />
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
  return { title: restaurant.name };
}
