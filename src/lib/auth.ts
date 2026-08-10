import { cookies } from "next/headers";
import crypto from "crypto";
const SECRET =
  process.env.SESSION_SECRET ?? "north-pole-magic-secret-keep-safe";
export type Session =
  | { role: "parent"; id: number }
  | { role: "kid"; id: number };
function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}
export function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function decodeSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    if (
      !crypto.timingSafeEqual(Buffer.from(sign(payload)), Buffer.from(sig))
    ) {
      return null;
    }
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}
export async function setSession(session: Session) {
  const store = await cookies();
  store.set("np_session", encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}
export async function clearSession() {
  const store = await cookies();
  store.delete("np_session");
}
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get("np_session")?.value);
}
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}
export function generateMagicCode(): string {
  const words = [
    "JINGLE",
    "SPARKLE",
    "COOKIE",
    "SNOWY",
    "TINSEL",
    "MERRY",
    "HOLLY",
    "FROSTY",
    "CANDY",
    "STAR",
  ];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${word}-${num}`;
}
