"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Snow from "@/components/Snow";
import { ElfAvatar, TwinkleLights } from "@/components/Festive";
import { ADDONS, PLANS } from "@/lib/content";
import type { Elf } from "@/lib/elves";
type Letter = {
  id: number;
  sender: string;
  body: string;
  createdAt: string;
  readByParent: boolean;
};
type Kid = {
  id: number;
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  magicCode: string;
  paused: boolean;
  responseMode: string;
  elf: Elf;
  letterCount: number;
  letters: Letter[];
};
type Note = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};
type Parent = {
  id: number;
  name: string;
  email: string;
  plan: string;
  addons: string[];
};
const TABS = [
  { id: "children", label: "👧 Children" },
  { id: "plans", label: "💳 Plans & Add-ons" },
  { id: "notifications", label: "🔔 Notifications" },
  { id: "share", label: "📣 Share the Magic" },
] as const;
export default function ParentDashboard() {
  const router = useRouter();
  const [parent, setParent] = useState<Parent | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("children");
  const [activeKidId, setActiveKidId] = useState<number | null>(null);
  const [claimCode, setClaimCode] = useState("");
  const [toast, setToast] = useState("");
  const [replyDraft, setReplyDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const res = await fetch("/api/parent/overview");
    if (res.status === 401) {
      router.push("/parent/login");
      return;
    }
    const data = await res.json();
    setParent(data.parent);
    setKids(data.children);
    setNotes(data.notifications);
    setActiveKidId((prev) => prev ?? data.children[0]?.id ?? null);
  }, [router]);
  useEffect(() => {
    load();
  }, [load]);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }
  async function claim() {
    setBusy(true);
    const res = await fetch("/api/parent/children", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ magicCode: claimCode }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      showToast(data.error ?? "Could not link child");
      return;
    }
    showToast(`✅ Linked ${data.firstName}'s profile!`);
    setClaimCode("");
    load();
  }
  async function updateKid(kidId: number, patch: Record<string, unknown>) {
    await fetch("/api/parent/children", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ childId: kidId, ...patch }),
    });
    load();
  }
  async function sendReply(kidId: number) {
    if (!replyDraft.trim()) return;
    setBusy(true);
    const res = await fetch("/api/parent/reply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ childId: kidId, body: replyDraft }),
    });
    setBusy(false);
    if (res.ok) {
      setReplyDraft("");
      showToast("💌 Your letter was delivered as the elf!");
      load();
    }
  }
  async function purchase(kind: "plan" | "addon", itemKey: string) {
    setBusy(true);
    const res = await fetch("/api/parent/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemKey }),
    });
    setBusy(false);
    if (res.ok) {
      showToast(kind === "plan" ? "🎄 Plan activated! (demo checkout)" : "🎁 Add-on purchased! (demo checkout)");
      load();
    }
  }
  async function markAllRead() {
    await fetch("/api/parent/notifications", { method: "PATCH" });
    load();
  }
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }
  async function share() {
    const text =
      "My child has a magical North Pole pen pal! 🎅✨ They write real letters to their own elf at North Pole Pen Pals. #ElfPenPal #ChristmasMagic";
    if (navigator.share) {
      try {
        await navigator.share({ title: "North Pole Pen Pals", text, url: window.location.origin });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
    showToast("📋 Copied share message to clipboard!");
  }
  if (!parent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center">
        <Snow count={16} />
        <p className="animate-pulse text-2xl font-extrabold text-white">
          ❄️ Loading the Parent Portal...
        </p>
      </main>
    );
  }
  const activeKid = kids.find((k) => k.id === activeKidId) ?? null;
  const unread = notes.filter((n) => !n.read).length;
  const planTitle = PLANS.find((p) => p.key === parent.plan)?.title ?? "Free Starter";
  return (
    <main className="relative min-h-screen pb-16">
      <Snow count={16} />
      <TwinkleLights />
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-yellow-400 px-6 py-3 font-extrabold text-emerald-950 shadow-2xl">
          {toast}
        </div>
      )}
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            👨‍👩‍👧 Parent Portal
          </h1>
          <p className="text-sm text-emerald-100/80">
            Welcome, {parent.name} · Plan:{" "}
            <b className="text-yellow-300">{planTitle}</b>
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/25"
        >
          Log out
        </button>
      </header>
      <nav className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
              tab === t.id
                ? "bg-yellow-400 text-emerald-950 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {t.label}
            {t.id === "notifications" && unread > 0 && (
              <span className="ml-1.5 rounded-full bg-red-600 px-1.5 text-xs text-white">
                {unread}
              </span>
            )}
          </button>
        ))}
      </nav>
      <section className="mx-auto mt-4 max-w-6xl px-4">
        {/* CHILDREN */}
        {tab === "children" && (
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="space-y-3">
              {kids.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setActiveKidId(k.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    activeKidId === k.id
                      ? "bg-white shadow-xl ring-2 ring-yellow-400"
                      : "bg-white/70 hover:bg-white/90"
                  }`}
                >
                  <ElfAvatar elf={k.elf} size="sm" />
                  <div>
                    <p className="font-extrabold text-emerald-900">
                      {k.firstName}, {k.age}
                    </p>
                    <p className="text-xs text-slate-500">
                      Elf: {k.elf.name} · {k.letterCount} letters
                    </p>
                    {k.paused && (
                      <p className="text-xs font-bold text-red-600">⏸ Paused</p>
                    )}
                  </div>
                </button>
              ))}
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="text-sm font-extrabold text-emerald-900">
                  ➕ Link a child profile
                </p>
                <p className="text-xs text-slate-500">
                  Enter the child&apos;s Magic Code
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                    placeholder="JINGLE-1234"
                    className="w-full rounded-lg border-2 border-emerald-200 p-2 text-sm font-bold outline-none focus:border-emerald-600"
                  />
                  <button
                    onClick={claim}
                    disabled={busy || !claimCode.trim()}
                    className="rounded-lg bg-emerald-700 px-3 text-sm font-bold text-white disabled:opacity-40"
                  >
                    Link
                  </button>
                </div>
                <a
                  href="/kid/register"
                  className="mt-2 block text-center text-xs font-bold text-red-600 hover:underline"
                >
                  Or register a new child →
                </a>
              </div>
            </div>
            {activeKid ? (
              <div className="space-y-4">
                {/* Controls */}
                <div className="rounded-2xl bg-white p-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold text-emerald-900">
                        {activeKid.firstName}&apos;s Pen Pal Settings
                      </p>
                      <p className="text-xs text-slate-500">
                        Magic Code: <b>{activeKid.magicCode}</b> · Favorite
                        color: {activeKid.favoriteColor} · Loves:{" "}
                        {activeKid.favoriteActivity}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateKid(activeKid.id, { paused: !activeKid.paused })
                      }
                      className={`rounded-full px-4 py-2 text-sm font-extrabold ${
                        activeKid.paused
                          ? "bg-emerald-600 text-white"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {activeKid.paused ? "▶ Resume Conversations" : "⏸ Pause Conversations"}
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-600">
                      Who writes the elf&apos;s replies?
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        ["ai", "🤖 AI Elf (instant)"],
                        ["parent", "✍️ Parent only"],
                        ["both", "🤝 AI + Parent"],
                      ].map(([mode, label]) => (
                        <button
                          key={mode}
                          onClick={() =>
                            updateKid(activeKid.id, { responseMode: mode })
                          }
                          className={`rounded-full px-4 py-2 text-sm font-bold ${
                            activeKid.responseMode === mode
                              ? "bg-emerald-700 text-white"
                              : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Write as elf */}
                <div className="rounded-2xl bg-white p-5 shadow-xl">
                  <p className="font-extrabold text-emerald-900">
                    ✍️ Write to {activeKid.firstName} as {activeKid.elf.name}{" "}
                    {activeKid.elf.emoji}
                  </p>
                  <textarea
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    rows={4}
                    placeholder={`Write a letter — it will arrive signed by ${activeKid.elf.name}...`}
                    className="mt-2 w-full rounded-xl border-2 border-emerald-100 p-3 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => sendReply(activeKid.id)}
                    disabled={busy || !replyDraft.trim()}
                    className="mt-2 rounded-full bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-40"
                  >
                    Send as {activeKid.elf.name} 💌
                  </button>
                </div>
                {/* Letter history */}
                <div className="rounded-2xl bg-white p-5 shadow-xl">
                  <p className="font-extrabold text-emerald-900">
                    📬 Full Letter History ({activeKid.letters.length})
                  </p>
                  <div className="nice-scroll mt-3 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {activeKid.letters.length === 0 && (
                      <p className="text-sm text-slate-400">No letters yet.</p>
                    )}
                    {activeKid.letters.map((l) => (
                      <div
                        key={l.id}
                        className={`rounded-xl p-3 text-sm ${
                          l.sender === "child"
                            ? "bg-emerald-50 ring-1 ring-emerald-200"
                            : "bg-amber-50 ring-1 ring-amber-200"
                        }`}
                      >
                        <p className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                          <span>
                            {l.sender === "child"
                              ? `📤 ${activeKid.firstName}`
                              : `💌 ${activeKid.elf.name} (elf)`}
                          </span>
                          <span>{new Date(l.createdAt).toLocaleString()}</span>
                        </p>
                        <p className="whitespace-pre-wrap text-slate-700">{l.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/80 p-10 text-center">
                <div className="text-5xl">🧝</div>
                <p className="mt-2 font-extrabold text-emerald-900">
                  No children linked yet
                </p>
                <p className="text-sm text-slate-500">
                  Register a child or link one with their Magic Code to see
                  every letter, control replies, and unlock magic.
                </p>
              </div>
            )}
          </div>
        )}
        {/* PLANS */}
        {tab === "plans" && (
          <div>
            <h2 className="text-2xl font-extrabold text-white">💳 Subscription Plans</h2>
            <p className="text-sm text-emerald-100/80">
              Demo checkout — no real payment is processed.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={`rounded-2xl bg-white p-6 shadow-xl ${
                    parent.plan === plan.key ? "ring-4 ring-yellow-400" : ""
                  }`}
                >
                  <div className="text-3xl">{plan.emoji}</div>
                  <p className="mt-1 text-lg font-extrabold text-emerald-900">
                    {plan.title}
                  </p>
                  <p className="text-2xl font-extrabold text-red-700">
                    ${(plan.priceCents / 100).toFixed(2)}
                    <span className="text-xs font-semibold text-slate-500">
                      {plan.period}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {plan.perks.map((p) => (
                      <li key={p}>🎁 {p}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => purchase("plan", plan.key)}
                    disabled={busy || parent.plan === plan.key}
                    className="mt-3 w-full rounded-full bg-emerald-700 py-2 text-sm font-extrabold text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {parent.plan === plan.key ? "✓ Current Plan" : "Choose Plan"}
                  </button>
                </div>
              ))}
            </div>
            <h3 className="mt-8 text-xl font-extrabold text-white">🎁 Magical Add-ons</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ADDONS.map((a) => {
                const owned = parent.addons.includes(a.key);
                return (
                  <div key={a.key} className="rounded-2xl bg-white p-4 shadow-lg">
                    <p className="font-extrabold text-emerald-900">
                      {a.emoji} {a.title}
                    </p>
                    <p className="text-xs text-slate-500">{a.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-extrabold text-red-700">
                        ${(a.priceCents / 100).toFixed(2)}
                      </span>
                      <button
                        onClick={() => purchase("addon", a.key)}
                        disabled={busy || owned}
                        className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-extrabold text-white hover:bg-red-700 disabled:bg-emerald-600 disabled:opacity-80"
                      >
                        {owned ? "✓ Purchased" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* NOTIFICATIONS */}
        {tab === "notifications" && (
          <div className="rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-emerald-900">
                🔔 Notifications
              </h2>
              <button
                onClick={markAllRead}
                className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-900 hover:bg-emerald-200"
              >
                Mark all read
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {notes.length === 0 && (
                <p className="text-sm text-slate-400">
                  Nothing yet — notifications appear when your child gets
                  letters, certificates, or videos.
                </p>
              )}
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-xl p-3 text-sm ${
                    n.read ? "bg-slate-50" : "bg-yellow-50 ring-1 ring-yellow-300"
                  }`}
                >
                  <span className="text-xl">
                    {n.type === "letter" ? "✉️" : n.type === "certificate" ? "📜" : n.type === "video" ? "🎬" : "🎄"}
                  </span>
                  <div>
                    <p className="text-slate-700">{n.message}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* SHARE */}
        {tab === "share" && (
          <div className="mx-auto max-w-xl">
            <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-8 text-center text-white shadow-2xl ring-4 ring-yellow-400/60">
              <div className="text-5xl">🎅✨</div>
              <p className="font-hand mt-3 text-3xl">
                &quot;My child has a magical North Pole pen pal!&quot;
              </p>
              <p className="mt-2 text-sm text-red-100">
                {kids.length > 0
                  ? `${kids.map((k) => k.firstName).join(" & ")} ${kids.length > 1 ? "are" : "is"} pen pals with ${[...new Set(kids.map((k) => k.elf.name))].join(" & ")} at the North Pole! 🧝`
                  : "Letters, games, videos and certificates — straight from Santa's workshop."}
              </p>
              <div className="mt-4 text-xl">🎄 ❄️ 💌 🎁 ⭐</div>
              <button
                onClick={share}
                className="mt-5 rounded-full bg-yellow-400 px-8 py-3 font-extrabold text-emerald-950 shadow-lg transition hover:scale-105"
              >
                📣 Share the Magic
              </button>
              <p className="mt-3 text-xs text-red-200">
                Uses your device&apos;s share menu, or copies a festive message
                to your clipboard.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
