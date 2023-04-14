import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const token = await req.cookies.get("jwt").value;
    const user = await verifyToken(token);
    console.log(user);
    if (user === 401) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in.",
        error: "Unauthorized Request",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        booker_email: user.email,
        booking_time: {
          gte: new Date().toISOString(),
        },
      },
      select: {
        id: true,
        restaurant: {
          select: { name: true },
        },
        booking_time: true,
        number_of_people: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully got your bookings",
      data: bookings,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch your bookings. Please try again.",
      error: "Internal server error",
    });
  }
}
