import Link from "next/link";

import OwnerRoutes from "./components/ownerRoutes";
import Authenticate from "./components/Authenticate";

export default function Layout({ children }) {
  return (
    <>
      {/* <Authenticate /> */}
      <main className="relative lg:flex w-full max-w-screen-lg mx-auto justify-between py-8 md:py-16 overflow-hidden">
        <label
          htmlFor="dashboard-toggle"
          className="lg:hidden cursor-pointer border rounded py-1 px-4 m-2 inline-block text-sm"
        >
          Menu
        </label>
        <input type="checkbox" id="dashboard-toggle" hidden />
        <div className="bg-white absolute lg:static z-50 -left-[100%] flex flex-col  w-[90%] sm:max-w-[300px] lg:w-[24.5%] h-full transition-all   border-r p-2 lg:pr-4">
          <Link
            className="display-inline-block py-2 bg-gray-100 mb-2 text-blue-400 rounded-md px-4 hover:bg-blue-400 cursor-pointer hover:text-white"
            href="/"
          >
            Home
          </Link>
          <Link
            className="display-inline-block py-2 bg-gray-100 mb-2 text-blue-400 rounded-md px-4 hover:bg-blue-400 cursor-pointer hover:text-white"
            href="/dashboard/bookings"
          >
            Bookings
          </Link>
          <Link
            className="display-inline-block py-2 bg-gray-100 mb-2 text-blue-400 rounded-md px-4 hover:bg-blue-400 cursor-pointer hover:text-white"
            href="/dashboard/my-account"
          >
            Account Info
          </Link>
          <Link
            className="display-inline-block py-2 bg-gray-100 mb-2 text-blue-400 rounded-md px-4 hover:bg-blue-400 cursor-pointer hover:text-white"
            href="/dashboard/add-restaurant"
          >
            <div className="flex items-center">
              <span className="text-white bg-blue-400 rounded-sm flex items-center justify-center h-5 w-5 mr-2">
                +
              </span>
              Add Restaurant
            </div>
          </Link>
          <OwnerRoutes />
        </div>
        <div className="w-full h-auto px-2 overflow-y-scroll lg:w-[74.5%]">
          {children}
        </div>
      </main>
    </>
  );
}
