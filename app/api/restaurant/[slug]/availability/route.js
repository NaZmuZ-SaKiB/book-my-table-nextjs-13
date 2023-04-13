import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import getSearchParams from "@/utils/getQueryParamsFromURL";
import { findAvailableTables } from "@/utils/findAvailableTables";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    console.log("fetch availability");
    const { slug } = params;
    const { day, time, partySize } = getSearchParams(req.url);

    if (!day || !time || !partySize) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const searchTimesWithTables = await findAvailableTables({
      day,
      time,
      restaurant,
      NextResponse,
    });

    if (!searchTimesWithTables)
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });

    // Checking time is available or not
    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);
        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability) => {
        const timeIsAfterOpeningHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
      });

    return NextResponse.json({
      status: "success",
      message: "Successfully got the data.",
      data: availabilities,
    });
  } catch (error) {
    return NextResponse.json({
      status: "success",
      message: "Could not get the data.",
      error: "Internal Server Error",
    });
  }
}
