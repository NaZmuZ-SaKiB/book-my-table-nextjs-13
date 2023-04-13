import { PrismaClient } from "@prisma/client";
import validator from "validator";

import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { name, price, description } = await req.json();
    const isPrice = price
      ? validator.isCurrency(price, [{ allow_negatives: false }])
      : false;

    if (!name || !price || !description || !isPrice) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const token = await req.cookies.get("jwt").value;
    const decoded = await verifyToken(token);
    if (decoded === 401 || decoded.role === "USER") {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in or you are an owner",
        error: "Unauthorized Request",
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: params.slug,
      },
    });
    if (!restaurant || restaurant.owner_id !== decoded.id) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in or you are an owner.",
        error: "Unauthorized Request",
      });
    }

    await prisma.item.create({
      data: {
        name,
        price,
        description,
        restaurant_id: restaurant.id,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully added new item.",
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not add your item. Please try again.",
      error: "Internal Server Error",
    });
  }
}
