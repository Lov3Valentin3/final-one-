import { NextResponse } from "next/server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
/** Claim a child by magic code, or update child settings. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { magicCode } = await req.json();
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.magicCode, (magicCode ?? "").trim().toUpperCase()));
  if (!child) {
    return NextResponse.json(
      { error: "No child found with that magic code." },
      { status: 404 }
    );
  }
  if (child.parentId && child.parentId !== session.id) {
    return NextResponse.json(
      { error: "This child is already linked to another parent account." },
      { status: 409 }
    );
  }
  await db
    .update(children)
    .set({ parentId: session.id })
    .where(eq(children.id, child.id));
  return NextResponse.json({ ok: true, firstName: child.firstName });
}
export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { childId, paused, responseMode } = await req.json();
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, Number(childId)));
  if (!child || child.parentId !== session.id) {
    return NextResponse.json({ error: "Not your child profile" }, { status: 403 });
  }
  const updates: { paused?: boolean; responseMode?: string } = {};
  if (typeof paused === "boolean") updates.paused = paused;
  if (["ai", "parent", "both"].includes(responseMode)) {
    updates.responseMode = responseMode;
  }
  await db.update(children).set(updates).where(eq(children.id, child.id));
  return NextResponse.json({ ok: true });
}
