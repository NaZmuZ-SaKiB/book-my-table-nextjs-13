import MenuCard from "../../../../components/MenuCard";

export default async function Menu({ menu }) {
  console.log("From Menu");
  console.log(menu);
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="text-center md:text-left font-medium md:font-bold text-3xl md:text-4xl">
            Menu
          </h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {menu.items.length ? (
            menu.items.map((item) => <MenuCard key={item.id} item={item} />)
          ) : (
            <p>This restaurant does not have any menu.</p>
          )}
        </div>
      </div>
    </main>
  );
}
