import { getSession } from "@/lib/auth";
import { CERTIFICATES } from "@/lib/content";
import { getElf } from "@/lib/elves";
import Link from "next/link";
import { redirect } from "next/navigation";
import PrintButton from "@/components/PrintButton";
export default async function CertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ child?: string }>;
}) {
  const { key } = await params;
  const { child: childParam } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/");
  let childId: number | null = null;
  if (session.role === "kid") {
    childId = session.id;
  } else if (childParam) {
    const [kid] = await db
      .select()
      .from(children)
      .where(eq(children.id, Number(childParam)));
    if (kid && kid.parentId === session.id) childId = kid.id;
  }
  if (!childId) redirect(session.role === "kid" ? "/kid" : "/parent");
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, childId));
  const def = CERTIFICATES.find((c) => c.key === key);
  if (!child || !def) redirect("/");
  const [owned] = await db
    .select()
    .from(certificates)
    .where(
      and(eq(certificates.childId, child.id), eq(certificates.certKey, key))
    );
  if (!owned) redirect(session.role === "kid" ? "/kid" : "/parent");
  const elf = getElf(child.elfId);
  const date = new Date(owned.unlockedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between px-4">
        <Link
          href={session.role === "kid" ? "/kid" : "/parent"}
          className="font-bold text-emerald-800 hover:underline"
        >
          ← Back to dashboard
        </Link>
        <PrintButton />
      </div>
      <div className="print-area mx-auto max-w-3xl rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 p-3 shadow-2xl">
        <div className="rounded border-8 border-double border-yellow-600 p-8 text-center sm:p-12">
          <div className="text-5xl">{def.emoji}</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-red-700">
            ⋆ The North Pole Official Registry ⋆
          </p>
          <h1 className="font-hand mt-4 text-4xl font-extrabold text-emerald-900 sm:text-5xl">
            {def.title}
          </h1>
          <p className="mt-6 text-sm uppercase tracking-widest text-slate-500">
            This certifies that
          </p>
          <p className="font-hand mt-2 text-5xl text-red-700">{child.firstName}</p>
          <p className="mx-auto mt-4 max-w-md text-slate-600">{def.description}</p>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-8 text-sm">
            <div className="border-t-2 border-slate-400 pt-2">
              <p className="font-hand text-2xl text-emerald-800">Santa Claus 🎅</p>
              <p className="text-xs text-slate-500">Santa Claus, The North Pole</p>
            </div>
            <div className="border-t-2 border-slate-400 pt-2">
              <p className="font-hand text-2xl text-emerald-800">
                {elf.name} {elf.emoji}
              </p>
              <p className="text-xs text-slate-500">{elf.job}</p>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-400">
            Sealed with Christmas magic on {date} · Certificate № NP-
            {String(owned.id).padStart(6, "0")}
          </p>
          <div className="mt-2 text-2xl">🎄 ❄️ 🎁 ⭐ 🦌</div>
        </div>
      </div>
    </main>
  );
}
function PrintButton() {
  return (
    <a
      href="javascript:window.print()"
      className="rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow hover:bg-red-700"
    >
      🖨️ Print Certificate
    </a>
  );
}