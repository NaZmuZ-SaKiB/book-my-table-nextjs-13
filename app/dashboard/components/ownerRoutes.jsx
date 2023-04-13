"use client";

import Link from "next/link";
import { useContext } from "react";

import { AuthenticationContext } from "@/context/AuthContext";

export default function OwnerRoutes() {
  const { data } = useContext(AuthenticationContext);
  if (data?.role === "OWNER") {
    return (
      <>
        <Link
          className="display-inline-block py-2 bg-gray-100 mb-2 text-blue-400 rounded-md px-4 hover:bg-blue-400 cursor-pointer hover:text-white"
          href="/dashboard/my-restaurants"
        >
          Restaurants
        </Link>
      </>
    );
  } else {
    return null;
  }
}
