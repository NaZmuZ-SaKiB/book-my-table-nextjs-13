import { notFound } from "next/navigation";

import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";

const fetchRestaurantMenu = async (slug) => {
  const jsonRes = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${slug}/menu`,
    { next: { revalidate: 60 } }
  );
  const res = await jsonRes.json();
  if (res.status === "success") {
    return res.data;
  } else {
    return notFound();
  }
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
  const jsonRes = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant`
  );
  const res = await jsonRes.json();

  return res.data.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}

export async function generateMetadata({ params }) {
  const jsonRes = await fetch(
    // eslint-disable-next-line no-undef
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${params.slug}`
  );
  const res = await jsonRes.json();
  return { title: `Menu | ${res?.data?.name}` };
}
