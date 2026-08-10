import { NextResponse } from "next/server";
import { db } from "@/db";
import { achievements, certificates, children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getElf } from "@/lib/elves";
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "kid") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, session.id));
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const certs = await db
    .select()
    .from(certificates)
    .where(eq(certificates.childId, child.id));
  const ach = await db
    .select()
    .from(achievements)
    .where(eq(achievements.childId, child.id));
  return NextResponse.json({
    child: {
      id: child.id,
      firstName: child.firstName,
      age: child.age,
      favoriteColor: child.favoriteColor,
      favoriteActivity: child.favoriteActivity,
      magicCode: child.magicCode,
      paused: child.paused,
    },