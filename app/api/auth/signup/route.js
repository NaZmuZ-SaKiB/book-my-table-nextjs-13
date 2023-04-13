import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, city, password } =
      await req.json();

    const validatorSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid!",
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "Last name is invalid!",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid!",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone is invalid!",
      },
      {
        valid: validator.isLength(city, { min: 1, max: 20 }),
        errorMessage: "City is invalid!",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is week!",
      },
    ];

    const validationErrors = [];

    validatorSchema.forEach((check) => {
      if (!check.valid) {
        validationErrors.push(check?.errorMessage);
      }
    });

    if (validationErrors.length) {
      return NextResponse.json({
        status: "fail",
        message: validationErrors[0],
        error: "Validation Error",
      });
    }

    const userEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userEmail) {
      return NextResponse.json({
        status: "fail",
        message: "Make sure you have entered correct email and password.",
        error: "Invalid Credentials",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        email,
        city,
        phone,
      },
    });

    const token = jwt.sign(
      { email, id: user.id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "3days",
      },
      { algorithm: "HS256" }
    );

    delete user.password;

    return NextResponse.json({
      status: "success",
      message: `Hi ${user.first_name}. Successfully created a new account.`,
      data: { user, token },
    });
  } catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "Could not create an account. Please try again!",
      error: "Internal server error",
    });
  }
}
