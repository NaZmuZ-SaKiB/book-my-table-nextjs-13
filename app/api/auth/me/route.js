import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
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

    delete user.password;

    return NextResponse.json({
      status: "success",
      message: `Hi ${user.first_name}. Successfully authenticated.`,
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not authenticate. Please signin.",
      error: "Internal server error",
    });
  }
}

export async function PATCH(req) {
  try {
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

    const { first_name, last_name, email, phone, city } = await req.json();
    if (!first_name || !last_name || !email || !phone || !city) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const user = await prisma.user.update({
      where: { email: decoded.email },
      data: {
        first_name,
        last_name,
        phone,
        city,
        email,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully updated your info.",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not update your info. Please try again.",
      error: "Internal server error",
    });
  }
}
