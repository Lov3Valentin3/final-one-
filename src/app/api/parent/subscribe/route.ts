import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, notifications, parents, subscriptionEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ADDONS, PLANS } from "@/lib/content";
import { unlockCertificate } from "@/lib/unlocks";
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  const { kind, itemKey } = await req.json();
  const [parent] = await db
    .select()
    .from(parents)
    .where(eq(parents.id, session.id));
  if (!parent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (kind === "plan") {
    const plan = PLANS.find((p) => p.key === itemKey);
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }
    await db
      .update(parents)
      .set({ plan: plan.key })
      .where(eq(parents.id, parent.id));
    await db.insert(subscriptionEvents).values({
      parentId: parent.id,
      kind: "plan",
      itemKey: plan.key,
      amountCents: plan.priceCents,
    });
    await db.insert(notifications).values({
      parentId: parent.id,
      type: "countdown",
      message: `Welcome to ${plan.title}! Your North Pole membership is active. 🎄`,
    });
    return NextResponse.json({ ok: true });
  }
  if (kind === "addon") {
    const addon = ADDONS.find((a) => a.key === itemKey);
    if (!addon) {
      return NextResponse.json({ error: "Unknown add-on" }, { status: 400 });
    }
    const addons = JSON.parse(parent.addons) as string[];
    if (!addons.includes(addon.key)) addons.push(addon.key);
    await db
      .update(parents)
      .set({ addons: JSON.stringify(addons) })
      .where(eq(parents.id, parent.id));
    await db.insert(subscriptionEvents).values({
      parentId: parent.id,
      kind: "addon",
      itemKey: addon.key,
      amountCents: addon.priceCents,
    });
    // Nice List certificate addon unlocks the premium certificate for all children
    if (addon.key === "nice-list-cert") {
      const kids = await db
        .select()
        .from(children)
        .where(eq(children.parentId, parent.id));
      for (const kid of kids) {
        await unlockCertificate(kid.id, "nice-list", parent.id, kid.firstName);
      }
    }
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown purchase" }, { status: 400 });
}