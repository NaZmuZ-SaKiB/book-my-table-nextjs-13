import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import verifyToken from "@/utils/verifyToken";
import validateReqBody from "./validation";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { slug } = params;

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
        slug,
      },
      include: {
        items: true,
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

    return NextResponse.json({
      status: "success",
      message: "Successfully fetched your restaurant.",
      data: restaurant,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch your restaurant. Please try again.",
      error: "Internal Server Error",
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { slug } = params;
    const {
      name,
      main_image,
      description,
      open_time,
      close_time,
      price,
      images,
    } = await req.json();

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
        slug,
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

    const validationErrors = validateReqBody({
      name,
      main_image,
      description,
      open_time,
      close_time,
      price,
      images,
    });

    if (validationErrors.length) {
      return NextResponse.json({
        status: "fail",
        message: validationErrors[0],
        error: "Validation Error",
      });
    }

    await prisma.restaurant.update({
      where: { slug },
      data: {
        name,
        main_image,
        description,
        open_time,
        close_time,
        price,
        images,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully saved changes.",
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not update your restaurant. Please try again.",
      error: "Internal Server Error",
    });
  }
}
