/* eslint-disable no-undef */
import axios from "axios";
import { useState } from "react";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setdata] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  }) => {
    setLoading(true);
    setdata(null);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/restaurant/${slug}/reserve`,
        {
          bookerEmail,
          bookerPhone,
          bookerFirstName,
          bookerLastName,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: { day, time, partySize },
        }
      );

      if (res?.data?.status === "success") {
        setdata(res?.data);
        setError(null);
      } else {
        setdata(null);
        setError({ message: res?.data?.message, error: res?.data?.error });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setdata(null);
      setError({
        error: "Data Fetching Error",
        message: "Ops there was a problem. Please try loading the page again.",
      });
    }
  };
  return { loading, data, error, createReservation };
}
