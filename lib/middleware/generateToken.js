import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function generateTokensAndSetCookie(userId, response) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });

  if (response && response.cookies) {
    response.cookies.set("jwt", token, {
    httpOnly: true,
    path: "/",
      maxAge: 15 * 24 * 60 * 60, // 15 يوم
    });
  } else {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "jwt",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 15 * 24 * 60 * 60,
    });
  }

  return token;
}
