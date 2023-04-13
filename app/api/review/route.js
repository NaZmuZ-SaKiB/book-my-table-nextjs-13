import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = await req.cookies.get("jwt").value;
    const decodedUser = await verifyToken(token);
    if (decodedUser === 401) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in.",
        error: "Unauthorized Request",
      });
    }

    const { text, rating, restaurant_id } = await req.json();

    if (!text || !rating || !restaurant_id) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurant_id },
    });

    if (!restaurant) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: decodedUser.email },
      select: { id: true, first_name: true, last_name: true },
    });

    if (!user) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const reviewData = {
      first_name: user.first_name,
      last_name: user.last_name,
      text,
      rating,
      restaurant_id,
      user_id: user.id,
    };

    await prisma.review.create({
      data: reviewData,
    });

    return NextResponse.json({
      status: "success",
      message: "Thanks for your review. It will be live soon.",
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not submit you review. Please try again.",
      error: "Internal Server Error",
    });
  }
}
