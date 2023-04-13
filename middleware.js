import { NextResponse } from "next/server";

export default async function middleware(req) {
  try {
    const bearerToken = req.headers.get("Authorization");

    console.log("inside middleware");

    if (!bearerToken) {
      return NextResponse.json({
        status: "fail",
        message: "No token",
        error: "Unauthorized request!",
      });
    }

    const token = bearerToken.split(" ")[1];

    if (!token) {
      return NextResponse.json({
        status: "fail",
        message: "No token",
        error: "Unauthorized request!",
      });
    }

    return;
  } catch (error) {
    console.log(error);
    NextResponse.json({
      status: "fail",
      message: "Could not authenticate. Please signin.",
      error: "Internal server error",
    });
  }
}

export const config = {
  matcher: [
    "/api/auth/me",
    "/api/booking/my",
    "/api/auth/password",
    "/api/review",
    "/api/owner/restaurant/[slug]",
  ],
};
