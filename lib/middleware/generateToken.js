import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export const generateTokensAndSetCookie = (userId, response) => {
 const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
  expiresIn: "15d",
});

  response.cookies.set("jwt", token, {
    maxAge: 15 * 24 * 60 * 60, // بالثواني = 15 يوم
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });

  return response;
};
