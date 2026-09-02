import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "nsc_backoffice_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  exp: number;
  version: 1;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function authIsConfigured() {
  return Boolean(process.env.BACKOFFICE_PASSWORD && getSessionSecret().length >= 32);
}

export function passwordIsValid(password: string) {
  const expected = process.env.BACKOFFICE_PASSWORD;
  return expected ? secureEqual(password, expected) : false;
}

export function createSessionToken() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    version: 1,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token?: string) {
  if (!token || !authIsConfigured()) return false;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra || !secureEqual(signature, sign(encoded))) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.version === 1 && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
