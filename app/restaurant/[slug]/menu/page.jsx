/* eslint-disable no-undef */
import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";

export const metadata = {
  title: "Menu of Milestones Grill (Toronto) | BookMyTable",
};

const fetchRestaurantMenu = async (slug) => {
  const jsonRes = await fetch(
    `${process.env.baseApiURL}/api/restaurant/${slug}/menu`,
    { next: { revalidate: 60 } }
  );
  const res = await jsonRes.json();
  if (res.status === "success") {
    return res.data;
  } else {
    return { items: [] };
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
