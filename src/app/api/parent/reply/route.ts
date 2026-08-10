import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, letters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getElf } from "@/lib/elves";
/** Parent writes a letter as the elf. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { childId, body } = await req.json();
  if (!body || body.trim().length < 2) {
    return NextResponse.json({ error: "Letter is empty." }, { status: 400 });
  }
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, Number(childId)));
  if (!child || child.parentId !== session.id) {
    return NextResponse.json({ error: "Not your child profile" }, { status: 403 });
  }
  const elf = getElf(child.elfId);
  let text = body.trim();
  if (!text.toLowerCase().startsWith("dear")) {
    text = `Dear ${child.firstName},\n\n${text}`;
  }
  if (!text.includes(elf.name)) {
    text = `${text}\n\n${elf.signOff},\n${elf.name} ${elf.emoji}`;
  }
  await db.insert(letters).values({
    childId: child.id,
    sender: "elf",
    body: text,
    readByParent: true,
  });
  return NextResponse.json({ ok: true });
}