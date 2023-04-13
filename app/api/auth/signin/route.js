import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!validator.isEmail(email) || !password) {
      return NextResponse.json({
        status: "fail",
        message: "Make sure you have entered correct email and password.",
        error: "Invalid Credentials",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({
        status: "fail",
        message: "Make sure you have entered correct email and password.",
        error: "Invalid Credentials",
      });
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return NextResponse.json({
        status: "fail",
        message: "Make sure you have entered correct email and password.",
        error: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id, role: user.role },
      // eslint-disable-next-line no-undef
      process.env.TOKEN_SECRET,
      {
        expiresIn: "3days",
      },
      { algorithm: "HS256" }
    );

    delete user?.password;

    return NextResponse.json({
      status: "success",
      message: `Hi ${user.first_name}. Successfully signed in to your account.`,
      data: { user, token },
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not sign in. Please try again!",
      error: "Internal server error",
    });
  }
}
