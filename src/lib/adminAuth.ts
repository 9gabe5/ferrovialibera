import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "fvl_admin";

export function adminToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", pw).update("ferrovialibera-admin").digest("hex");
}

export function isAdmin(): boolean {
  const c = cookies().get(COOKIE);
  return !!c && c.value === adminToken();
}

export const ADMIN_COOKIE = COOKIE;
