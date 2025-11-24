import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}



