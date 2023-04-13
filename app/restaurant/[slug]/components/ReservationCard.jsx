"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import useAvailabilities from "@/hooks/useAvailabilities";
import { partySize as partySizes, times } from "../../../../data";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "@/utils/convertToDisplayTime";

export default function ReservationCard({ openTime, closeTime, slug }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const { loading, data, error, fetchAvailabilities } = useAvailabilities();

  const handleChangeDate = (date) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    } else {
      return setSelectedDate(null);
    }
  };

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow = [];
    let isWinthinWindow = false;
    times.forEach((time) => {
      if (time.time === openTime) isWinthinWindow = true;

      if (isWinthinWindow) timesWithinWindow.push(time);

      if (time.time === closeTime) isWinthinWindow = false;
    });

    return timesWithinWindow;
  };

  return (
    <div className="bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          defaultValue={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          className="py-3 border-b font-light"
        >
          {partySizes.map((size) => (
            <option key={size.label} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-[100%]"
            dateFormat="MMMM d"
            wrapperClassName="w-[100%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            defaultValue={time}
            onChange={(e) => setTime(e.target.value)}
            className="py-3 border-b font-light"
          >
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option key={time.time} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          disabled={loading}
          onClick={handleClick}
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-12"
        >
          {loading ? (
            <CircularProgress color="inherit" size={30} />
          ) : (
            "Find a Time"
          )}
        </button>
      </div>
      {data && data?.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time, i) =>
              time.available ? (
                <Link
                  key={i}
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time)}
                  </p>
                </Link>
              ) : (
                <p
                  key={i}
                  className="bg-gray-300 p-2 text-white cursor-not-allowed mb-3 rounded mr-3"
                >
                  {convertToDisplayTime(time.time)}
                </p>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
