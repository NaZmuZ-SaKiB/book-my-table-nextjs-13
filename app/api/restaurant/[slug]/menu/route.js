import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    const menu = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        items: true,
      },
    });

    if (!menu) {
      return NextResponse.json({
        status: "fail",
        message: "No menu found!",
        error: "Not found",
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Successfully fetched menu.",
      data: menu,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch menu. Please try again.",
      error: "Internal Server Error",
    });
  }
}
