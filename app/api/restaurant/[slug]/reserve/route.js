import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import getSearchParams from "@/utils/getQueryParamsFromURL";
import { findAvailableTables } from "@/utils/findAvailableTables";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { slug } = params;
    const { day, time, partySize } = getSearchParams(req.url);

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = await req.json();

    if (!day || !time || !partySize)
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant)
      return NextResponse.json({
        status: "fail",
        message: "Restaurant not found.",
        error: "Invalid Data Provided",
      });

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return NextResponse.json({
        status: "fail",
        message: "Restaurant is not open at that time.",
        error: "Invalid Data Provided",
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

    const searchTimeWithTables = searchTimesWithTables.find(
      (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    );

    if (!searchTimeWithTables)
      return NextResponse.json({
        status: "fail",
        message: "Can not book. Seats are booked at this time.",
        error: "Table Not Available",
      });

    const tablesCount = {
      2: [],
      4: [],
    };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) tablesCount[2].push(table.id);
      else tablesCount[4].push(table.id);
    });

    const tablesToBook = [];

    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push({ id: tablesCount[4][0] });
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          tablesToBook.push({ id: tablesCount[2][0] });
          tablesCount[2].shift();
          seatsRemaining -= 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push({ id: tablesCount[2][0] });
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          tablesToBook.push({ id: tablesCount[4][0] });
          tablesCount[4].shift();
          seatsRemaining -= 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_phone: bookerPhone,
        booker_occasion: bookerOccasion || "",
        booker_request: bookerRequest || "",
        restaurant_id: restaurant.id,
        tables: {
          connect: tablesToBook,
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully completed your reservation.",
      data: booking,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not complete your reservation. Please try again.",
      error: "Internal Server Error",
    });
  }
}
