import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      include: {
        reviews: true,
        bookings: true,
        items: true,
        tables: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({
        status: "fail",
        message: "No restaurants found!",
        error: "Not found",
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Successfully fetched restaurant.",
      data: restaurant,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch restaurant. Please try again.",
      error: "Internal Server Error",
    });
  }
}
