import { NextResponse } from "next/server";
import { db } from "@/db";
import { achievements, children } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { checkAutoUnlocks } from "@/lib/unlocks";
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "kid") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { key, title } = await req.json();
  if (!key || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, session.id));
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const existing = await db
    .select({ id: achievements.id })
    .from(achievements)
    .where(
      and(eq(achievements.childId, child.id), eq(achievements.key, key))
    );
  let isNew = false;
  if (existing.length === 0) {
    await db.insert(achievements).values({ childId: child.id, key, title });
    isNew = true;
  }
  const unlocked = await checkAutoUnlocks(
    child.id,
    child.parentId,
    child.firstName
  );
  return NextResponse.json({ ok: true, isNew, unlocked });
}