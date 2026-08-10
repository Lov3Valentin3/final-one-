import { NextResponse } from "next/server";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSession } from "@/lib/auth";
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Please fill in all fields (password must be 6+ characters)." },
      { status: 400 }
    );
  }
  const existing = await db
    .select()
    .from(parents)
    .where(eq(parents.email, email.toLowerCase()));
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }
  const [parent] = await db
    .insert(parents)
    .values({
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
    })
    .returning();
  await setSession({ role: "parent", id: parent.id });
  return NextResponse.json({ ok: true });
}