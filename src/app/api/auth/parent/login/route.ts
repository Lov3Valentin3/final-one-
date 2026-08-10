import { NextResponse } from "next/server";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession, verifyPassword } from "@/lib/auth";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const [parent] = await db
    .select()
    .from(parents)
    .where(eq(parents.email, (email ?? "").toLowerCase()));
  if (!parent || !verifyPassword(password ?? "", parent.passwordHash)) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 }
    );
  }
  await setSession({ role: "parent", id: parent.id });
  return NextResponse.json({ ok: true });
}