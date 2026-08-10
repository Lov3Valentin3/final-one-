import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, letters, notifications, parents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getElf } from "@/lib/elves";
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const [parent] = await db
    .select()
    .from(parents)
    .where(eq(parents.id, session.id));
  if (!parent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const kids = await db
    .select()
    .from(children)
    .where(eq(children.parentId, parent.id));
  const kidData = [];
  for (const kid of kids) {
    const kidLetters = await db
      .select()
      .from(letters)
      .where(eq(letters.childId, kid.id))
      .orderBy(desc(letters.createdAt), desc(letters.id));
    kidData.push({
      ...kid,
      elf: getElf(kid.elfId),
      letterCount: kidLetters.length,
      letters: kidLetters,
    });
  }
  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.parentId, parent.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
  return NextResponse.json({
    parent: {
      id: parent.id,
      name: parent.name,
      email: parent.email,
      plan: parent.plan,
      addons: JSON.parse(parent.addons) as string[],
    },
    children: kidData,
    notifications: notes,
  });
}

