import Header from "./components/Header";

export default function RestaurantLayout({ children, params }) {
  return (
    <>
      <Header name={params.slug} />
      <div className="flex m-auto w-full sm:w-[85%] lg:max-w-screen-lg justify-between items-start 0 -mt-8 sm:-mt-9 md:-mt-11">
        {children}
      </div>
    </>
  );
}
