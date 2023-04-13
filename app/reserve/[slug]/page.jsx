import { PrismaClient } from "@prisma/client";

import Header from "../components/Header";
import Form from "../components/Form";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug) => {
  setTimeout(() => {}, 5000);
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    // select: {
    //   id: true,
    //   name: true,
    //   description: true,
    //   images: true,
    //   slug: true,
    //   reviews: true,
    //   open_time: true,
    //   close_time: true,
    // },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export const metadata = {
  title: "Reserve at Milestones Grill (Toronto) | BookMyTable",
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
