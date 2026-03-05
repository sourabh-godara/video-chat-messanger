import jwt from "jsonwebtoken";
const { decode } = require("next-auth/jwt");
const secret = process.env.NEXTAUTH_SECRET!;

export async function verifySocketAuth(token: string) {
  try {
    if (!token) throw new Error("No token provided");
    const decoded = await decode({ token, secret });

    if (!decoded || !decoded.sub) throw new Error("Invalid token");

    return decoded.sub; // userId
  } catch (err) {
    console.error("Token verification error:", err);
    throw new Error("Token Verification Failed!");
  }
}
