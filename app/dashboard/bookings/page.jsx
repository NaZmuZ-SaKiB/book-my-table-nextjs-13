"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

import Booking from "../components/Booking";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refresh, setRefresh] = useState(1);
  const jwt = getCookie("jwt");

  const fetchUserBookings = async () => {
    setLoading(true);
    const res = await axios
      .get("/api/booking/my", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .catch(() => {
        setLoading(false);
      });

    setBookings(res.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserBookings();
  }, [jwt, refresh]);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div>
      {success && (
        <Alert onClose={() => setSuccess(null)} severity="success">
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}
      {error?.error && (
        <Alert onClose={() => setError(null)} severity="error">
          <AlertTitle>{error?.error}</AlertTitle>
          {error?.message}
        </Alert>
      )}
      {bookings.length ? (
        <>
          <h2 className="text-center text-3xl font-bold text-blue-500 mb-5 lg:mb-10">
            Your Bookings
          </h2>
          <div className="overflow-auto  rounded-md shadow w-full max-w-screen-md mx-auto">
            <table className="table-auto w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b-2 border-gray-200 h-10">
                <tr>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Restaurant
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Date | Time
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    People
                  </th>
                  <th className="px-2 text-sm sm:text-reg font-medium">
                    Cancel booking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <Booking
                    key={`My booking ${booking.id}`}
                    booking={booking}
                    setSuccess={setSuccess}
                    setError={setError}
                    setRefresh={setRefresh}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className="text-center text-3xl font-bold text-red-600">
          No Upcoming Bookings
        </h2>
      )}
    </div>
  );
}
