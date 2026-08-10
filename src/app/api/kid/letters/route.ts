import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, letters, notifications } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getElf } from "@/lib/elves";
import { generateElfReply } from "@/lib/elf-ai";
import { checkAutoUnlocks } from "@/lib/unlocks";
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "kid") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const rows = await db
    .select()
    .from(letters)
    .where(eq(letters.childId, session.id))
    .orderBy(asc(letters.createdAt), asc(letters.id));
  // mark elf letters as read by child
  await db
    .update(letters)
    .set({ readByChild: true })
    .where(eq(letters.childId, session.id));
  return NextResponse.json({ letters: rows });
}
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "kid") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { body } = await req.json();
  if (!body || body.trim().length < 2) {
    return NextResponse.json(
      { error: "Your letter looks empty — write something magical first!" },
      { status: 400 }
    );
  }
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, session.id));
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const history = await db
    .select({ sender: letters.sender, body: letters.body })
    .from(letters)
    .where(eq(letters.childId, child.id))
    .orderBy(asc(letters.createdAt), asc(letters.id));
  await db.insert(letters).values({
    childId: child.id,
    sender: "child",
    body: body.trim(),
    readByChild: true,
  });
  let reply: string | null = null;
  const elf = getElf(child.elfId);
  if (!child.paused && child.responseMode !== "parent") {
    reply = await generateElfReply(
      elf,
      {
        firstName: child.firstName,
        age: child.age,
        favoriteColor: child.favoriteColor,
        favoriteActivity: child.favoriteActivity,
      },
      body.trim(),
      history.map((h) => ({ sender: h.sender === "parent" ? "elf" : h.sender, body: h.body }))
    );
    await db.insert(letters).values({
      childId: child.id,
      sender: "elf",
      body: reply,
    });
  }
  if (child.parentId) {
    await db.insert(notifications).values({
      parentId: child.parentId,
      childId: child.id,
      type: "letter",
      message: reply
        ? `${child.firstName} wrote to ${elf.name} and received a magical reply! ✉️`
        : `${child.firstName} sent a letter to ${elf.name}${child.paused ? " (conversation paused — no reply sent)" : " — waiting for your reply ✍️"}`,
    });
  }
  const unlocked = await checkAutoUnlocks(
    child.id,
    child.parentId,
    child.firstName
  );
  return NextResponse.json({ ok: true, replied: Boolean(reply), unlocked });
}