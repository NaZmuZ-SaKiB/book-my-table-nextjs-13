/* eslint-disable no-undef */
"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";

import Restaurant from "../components/Restaurant";

export default function MyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRestaurants = async () => {
    setLoading(true);
    const res = await axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/my`)
      .catch(() => {
        setLoading(false);
      });

    setRestaurants(res.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto">
      {restaurants.length ? (
        <>
          <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
            Your Restaurants
          </h2>
          <div className="overflow-auto  rounded-md shadow w-full">
            <table className="table-auto w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b-2 border-gray-200 h-10">
                <tr>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Restaurant
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Rating
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Bookings
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <Restaurant key={restaurant.id} restaurant={restaurant} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className="text-center text-3xl font-bold text-red-600">
          Could not find any restaurant. Please try again later.
        </h2>
      )}
    </div>
  );
}
