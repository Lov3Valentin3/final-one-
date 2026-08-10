import { db } from "@/db";
import { achievements, certificates, letters, notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { CERTIFICATES } from "./content";
export async function unlockCertificate(
  childId: number,
  certKey: string,
  parentId: number | null,
  childName: string
) {
  const existing = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      and(eq(certificates.childId, childId), eq(certificates.certKey, certKey))
    );
  if (existing.length > 0) return false;
  const def = CERTIFICATES.find((c) => c.key === certKey);
  await db.insert(certificates).values({
    childId,
    certKey,
    premium: def?.premium ?? false,
  });
  if (parentId && def) {
    await db.insert(notifications).values({
      parentId,
      childId,
      type: "certificate",
      message: `${childName} unlocked the "${def.title}" certificate! ${def.emoji}`,
    });
  }
  return true;
}
/** Check letter-count and achievement-count based unlocks. */
export async function checkAutoUnlocks(
  childId: number,
  parentId: number | null,
  childName: string
): Promise<string[]> {
  const unlocked: string[] = [];
  const childLetters = await db
    .select({ id: letters.id })
    .from(letters)
    .where(and(eq(letters.childId, childId), eq(letters.sender, "child")));
  if (childLetters.length >= 1) {
    if (await unlockCertificate(childId, "north-pole-friend", parentId, childName))
      unlocked.push("north-pole-friend");
  }
  if (childLetters.length >= 5) {
    if (await unlockCertificate(childId, "elf-best-friend", parentId, childName))
      unlocked.push("elf-best-friend");
  }
  const ach = await db
    .select({ id: achievements.id })
    .from(achievements)
    .where(eq(achievements.childId, childId));
  if (ach.length >= 1) {
    if (await unlockCertificate(childId, "santas-helper", parentId, childName))
      unlocked.push("santas-helper");
  }
  if (ach.length >= 3) {
    if (await unlockCertificate(childId, "kindness", parentId, childName))
      unlocked.push("kindness");
  }
  return unlocked;
}
