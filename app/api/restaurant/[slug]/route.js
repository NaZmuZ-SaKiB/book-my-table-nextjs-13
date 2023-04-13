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
      select: {
        id: true,
        name: true,
        main_image: true,
        images: true,
        cuisine: true,
        location: true,
        price: true,
        slug: true,
        owner_id: true,
        open_time: true,
        close_time: true,
        items: true,
        tables: true,
        reviews: true,
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
