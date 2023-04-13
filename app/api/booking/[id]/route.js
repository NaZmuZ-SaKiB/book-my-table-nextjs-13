import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      select: { id: true },
    });

    if (!booking) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    await prisma.booking.delete({ where: { id: booking.id } });

    return NextResponse.json({
      status: "success",
      message: "Successfully deleted your booking.",
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not cancel your booking. Please try again.",
      error: "Internal server error",
    });
  }
}
