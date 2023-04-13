import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const token = await req.cookies.get("jwt").value;
    const decoded = await verifyToken(token);
    if (decoded === 401 || decoded.role === "USER") {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in or you are an owner.",
        error: "Unauthorized Request",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in.",
        error: "Unauthorized Request",
      });
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        owner_id: user.id,
      },
      select: {
        id: true,
        name: true,
        reviews: true,
        slug: true,
        bookings: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully fetched your restaurants.",
      data: restaurants,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch your restaurants. Please try again.",
      error: "Internal Server Error",
    });
  }
}
