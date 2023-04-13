import Link from "next/link";

import Menu from "@/app/restaurant/[slug]/components/Menu";
import MenuCard from "@/components/MenuCard";

export default function Menus({ items, slug }) {
  return (
    <div>
      <Link
        href={`/dashboard/add-item/${slug}`}
        className="bg-blue-500 text-white rounded cursor-pointer p-2 px-4 inline-block mb-2"
      >
        Add Item
      </Link>
      {items.length ? (
        <>
          <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
            Menu Items
          </h2>
          <div className="flex justify-between flex-wrap">
            {items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <h2 className="text-center text-2xl font-medium text-red-600">
          No Menu Items
        </h2>
      )}
    </div>
  );
}
