import { NextResponse } from "next/server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/auth";
export async function POST(req: Request) {
  const { magicCode } = await req.json();
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.magicCode, (magicCode ?? "").trim().toUpperCase()));
  if (!child) {
    return NextResponse.json(
      { error: "Hmm, that magic code isn't in Santa's book. Check it and try again!" },
      { status: 401 }
    );
  }
  await setSession({ role: "kid", id: child.id });
  return NextResponse.json({ ok: true });
}
