import { jwtVerify } from "jose";

export async function getUserFromRequest(req) {
  try {
    const token = req.cookies.get("jwt")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    return payload.userId;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
