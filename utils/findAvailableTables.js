import { PrismaClient } from "@prisma/client";

import { times } from "@/data";

const prisma = new PrismaClient();

export const findAvailableTables = async ({ day, time, restaurant, res }) => {
  // Extracting SearchTimes according to the Time Query
  const searchTimes = times.find((t) => t.time === time)?.searchTimes; // Array[]

  if (!searchTimes) {
    return res.json({
      status: "fail",
      message: "Invalid data provided.",
      error: "Query Error",
    });
  }

  // Getting The Bookings of the SearchTimes if available
  const bookings = await prisma.booking.findMany({
    // Array[]
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj = {};
  // bookingTablesObj = {
  //    "14:00:00.000Z": {
  //      1: true,      (here 1 is table id)
  //      3: true,      (here 3 is table id)
  //    }
  // }
  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.id]: true,
        };
      }, {});
  });

  const tables = restaurant.tables;

  //  searchTimesWithTables = [{
  //    date: Given Date and EachSearchTime,
  //    time: EachSearchTime,
  //    tables: []Array of all the tables in the restaurant
  //  }]
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  // Filtering the tables which is booked
  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
