/* eslint-disable no-undef */
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import validator from "validator";

import verifyToken from "@/utils/verifyToken";

const prisma = new PrismaClient();

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

    const { password, currentPassword, confirmPassword } = await req.json();
    if (!password || !currentPassword || !confirmPassword) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid data provided.",
        error: "Query Error",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { password: true },
    });

    const checkPassword = bcrypt.compareSync(currentPassword, user.password);
    if (!checkPassword) {
      return NextResponse.json({
        status: "fail",
        message: "Wrong current password.",
        error: "Query Error",
      });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        status: "fail",
        message:
          "Passwords do not match. Make sure you entered the same password twice.",
        error: "Query Error",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return NextResponse.json({
        status: "fail",
        message:
          "Your Password is week. Use both upper and lower case, numbers and symbols. Must be at least 8 characters.",
        error: "Query Error",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully updated your password.",
      data: updateUser,
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not update your password. Please try again.",
      error: "Internal server error",
    });
  }
}
