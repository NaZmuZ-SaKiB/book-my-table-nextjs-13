import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import slug from "slug";

import validateReqBody from "./validation";
import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const restaurants = await prisma.restaurant.findMany({
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
    if (!restaurants) {
      return NextResponse.json({
        status: "fail",
        message: "No restaurants found!",
        error: "Not found",
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Successfully fetched all restaurants.",
      data: restaurants,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not fetch restaurants. Please try again.",
      error: "Internal Server Error",
    });
  }
}

export async function POST(req) {
  try {
    const {
      name,
      main_image,
      images,
      description,
      open_time,
      close_time,
      price,
      location_id,
      cuisine_id,
      tables,
    } = await req.json();

    const token = await req.cookies.get("jwt").value;

    const decoded = await verifyToken(token);

    if (decoded === 401) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in.",
        error: "Unauthorized Request",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return NextResponse.json({
        status: "fail",
        message:
          "You are not allowed to make this request. Make sure you are signed in.",
        error: "Unauthorized Request",
      });
    }

    const [validationErrors, location] = await validateReqBody({
      name,
      main_image,
      images,
      description,
      open_time,
      close_time,
      price,
      location_id,
      cuisine_id,
      tables,
    });

    if (validationErrors.length) {
      return NextResponse.json({
        status: "fail",
        message: validationErrors[0],
        error: "Validation Error",
      });
    }

    const restaurantData = {
      name,
      main_image,
      images,
      description,
      open_time,
      close_time,
      slug: slug(`${name} ${location.name}`),
      price,
      location_id,
      cuisine_id,
    };

    const restaurant = await prisma.restaurant.create({
      data: restaurantData,
    });

    const tableData = [];
    for (let i = 0; i < tables[0]; i++) {
      tableData.push({
        seats: 4,
        restaurant_id: restaurant.id,
      });
    }
    for (let i = 0; i < tables[1]; i++) {
      tableData.push({
        seats: 2,
        restaurant_id: restaurant.id,
      });
    }

    await prisma.table.createMany({
      data: tableData,
    });

    if (user.role === "USER") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "OWNER",
        },
      });
    }

    return NextResponse.json({
      status: "success",
      message: `Successfully added your restaurant ${restaurant.name}`,
      data: restaurant,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not create your restaurant. Please try again.",
      error: "Internal Server Error",
    });
  }
}
