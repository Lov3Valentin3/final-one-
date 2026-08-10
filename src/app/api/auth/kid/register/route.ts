import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, letters, notifications, parents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateMagicCode, setSession } from "@/lib/auth";
import { getElf } from "@/lib/elves";
export async function POST(req: Request) {
  const { firstName, age, favoriteColor, favoriteActivity, elfId, parentEmail } =
    await req.json();
  if (!firstName || !age || !favoriteColor || !favoriteActivity || !elfId) {
    return NextResponse.json(
      { error: "Please fill in every magical field!" },
      { status: 400 }
    );
  }
  const elf = getElf(elfId);
  let parentId: number | null = null;
  if (parentEmail) {
    const [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.email, parentEmail.toLowerCase()));
    if (parent) parentId = parent.id;
  }
  let magicCode = generateMagicCode();
  // ensure uniqueness
  for (let i = 0; i < 5; i++) {
    const clash = await db
      .select({ id: children.id })
      .from(children)
      .where(eq(children.magicCode, magicCode));
    if (clash.length === 0) break;
    magicCode = generateMagicCode();
  }
  const [child] = await db
    .insert(children)
    .values({
      firstName,
      age: Number(age),
      favoriteColor,
      favoriteActivity,
      elfId,
      magicCode,
      parentId,
    })
    .returning();
  // Welcome letter from the elf
  const welcome = `Dear ${firstName},\n\nIT'S OFFICIAL! ⭐ Santa just stamped the paperwork with his big golden stamp: you and I are now North Pole Pen Pals! I'm ${elf.name}, the ${elf.job.toLowerCase()} here at the North Pole.\n\nA little about me: my friends say I'm ${elf.personality.toLowerCase()}, I love ${elf.hobbies[0].toLowerCase()}, and my favorite treat is ${elf.treats[0].toLowerCase()}. ${elf.funFact}\n\nI heard your favorite color is ${favoriteColor} — amazing choice! — and that you love ${favoriteActivity.toLowerCase()}. We are going to be GREAT friends.\n\nWrite me a letter and tell me everything about you! What do you want for Christmas? Do you have any pets? What makes you giggle? I want to know it ALL.\n\nI'll be waiting by my ${favoriteColor.toLowerCase()} mailbox!\n\n${elf.signOff},\n${elf.name} ${elf.emoji}\n${elf.job}, North Pole`;
  await db.insert(letters).values({
    childId: child.id,
    sender: "elf",
    body: welcome,
  });
  if (parentId) {
    await db.insert(notifications).values({
      parentId,
      childId: child.id,
      type: "letter",
      message: `${firstName} joined the North Pole and got a welcome letter from ${elf.name}! 🎉`,
    });
  }
  await setSession({ role: "kid", id: child.id });
  return NextResponse.json({ ok: true, magicCode });
}