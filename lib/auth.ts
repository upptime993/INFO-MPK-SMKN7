import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-mpk-smkn7-2026";
export const COOKIE_NAME = "mpk_admin_token";

export interface AdminJwtPayload {
  adminId: string;
  username: string;
  nama?: string;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getSessionAdmin(): Promise<AdminJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
