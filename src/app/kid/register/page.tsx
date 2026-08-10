"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Snow from "@/components/Snow";
import { ElfAvatar, TwinkleLights } from "@/components/Festive";
import { ELVES, type Elf } from "@/lib/elves";
const COLORS = ["Red", "Green", "Blue", "Purple", "Pink", "Gold", "Rainbow", "Sparkly Silver"];
const ACTIVITIES = [
  "Decorating the tree",
  "Baking Christmas cookies",
  "Building snowmen",
  "Opening presents",
  "Singing carols",
  "Sledding",
  "Watching Christmas movies",
  "Leaving cookies for Santa",
];
export default function KidRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [favoriteActivity, setFavoriteActivity] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [selectedElf, setSelectedElf] = useState<Elf | null>(null);
  const [filter, setFilter] = useState<"all" | "boy" | "girl">("all");
  const [magicCode, setMagicCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canContinue = firstName.trim() && age && favoriteColor && favoriteActivity;
  async function submit() {
    if (!selectedElf) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/kid/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        age: Number(age),
        favoriteColor,
        favoriteActivity,
        elfId: selectedElf.id,
        parentEmail: parentEmail.trim() || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setMagicCode(data.magicCode);
    setStep(3);
  }
  const shownElves = ELVES.filter((e) => filter === "all" || e.gender === filter);
  return (
    <main className="relative min-h-screen pb-16">
      <Snow count={24} />
      <TwinkleLights />
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <Link href="/" className="text-sm font-semibold text-emerald-200 hover:text-white">
          ← Back to the North Pole
        </Link>
        {step === 1 && (
          <div className="mt-6 rounded-3xl bg-white/95 p-6 shadow-2xl ring-4 ring-yellow-400/50 sm:p-10">
            <h1 className="text-center text-3xl font-extrabold text-emerald-900">
              🧒 Tell Us About You!
            </h1>
            <p className="mt-1 text-center text-slate-500">
              Your elf wants to know all about their new best friend
            </p>
            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="font-bold text-emerald-900">Your First Name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Emma"
                  maxLength={30}
                  className="mt-1 w-full rounded-xl border-2 border-emerald-200 p-3 text-lg outline-none focus:border-red-500"
                />
              </label>
              <label className="block">
                <span className="font-bold text-emerald-900">How Old Are You?</span>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-emerald-200 bg-white p-3 text-lg outline-none focus:border-red-500"
                >
                  <option value="">Pick your age 🎂</option>
                  {Array.from({ length: 10 }, (_, i) => i + 3).map((a) => (
                    <option key={a} value={a}>{a} years old</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="font-bold text-emerald-900">Favorite Color</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFavoriteColor(c)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                        favoriteColor === c
                          ? "bg-red-600 text-white ring-2 ring-yellow-400"
                          : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-bold text-emerald-900">Favorite Christmas Activity</span>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {ACTIVITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setFavoriteActivity(a)}
                      className={`rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                        favoriteActivity === a
                          ? "bg-emerald-700 text-white ring-2 ring-yellow-400"
                          : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="font-bold text-emerald-900">
                  Parent&apos;s Email <span className="font-normal text-slate-400">(optional — links your grown-up&apos;s account)</span>
                </span>
                <input
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  type="email"
                  className="mt-1 w-full rounded-xl border-2 border-emerald-200 p-3 outline-none focus:border-red-500"
                />
              </label>
              <button
                disabled={!canContinue}
                onClick={() => setStep(2)}
                className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 py-4 text-xl font-extrabold text-white shadow-lg ring-2 ring-yellow-400/70 transition enabled:hover:scale-[1.02] disabled:opacity-40"
              >
                Next: Choose Your Elf Friend! 🧝 →
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6">
            <h1 className="text-center text-3xl font-extrabold text-white drop-shadow">
              🧝 Choose Your Elf Friend!
            </h1>
            <p className="mt-1 text-center text-emerald-100/80">
              20 elves are jumping up and down hoping you pick them!
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {(["all", "boy", "girl"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    filter === f
                      ? "bg-yellow-400 text-emerald-950"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {f === "all" ? "All Elves" : f === "boy" ? "Boy Elves" : "Girl Elves"}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shownElves.map((elf) => (
                <button
                  key={elf.id}
                  onClick={() => setSelectedElf(elf)}
                  className={`rounded-2xl bg-white p-5 text-left shadow-xl transition hover:-translate-y-1 ${
                    selectedElf?.id === elf.id
                      ? "ring-4 ring-yellow-400"
                      : "ring-1 ring-white/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ElfAvatar elf={elf} size="sm" />
                    <div>
                      <p className="text-lg font-extrabold text-emerald-900">{elf.name}</p>
                      <p className="text-xs font-semibold text-red-600">{elf.job}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{elf.bio}</p>
                  <div className="mt-2 space-y-0.5 text-[11px] text-slate-500">
                    <p>💫 <b>Personality:</b> {elf.personality}</p>
                    <p>🎯 <b>Hobbies:</b> {elf.hobbies.join(", ")}</p>
                    <p>🍪 <b>Treats:</b> {elf.treats.join(", ")}</p>
                    <p>🤩 <b>Fun fact:</b> {elf.funFact}</p>
                  </div>
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-4 rounded-xl bg-red-100 p-3 text-center font-bold text-red-700">{error}</p>
            )}
            <div className="sticky bottom-4 mt-6 flex justify-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-2xl bg-white/20 px-6 py-4 font-bold text-white backdrop-blur hover:bg-white/30"
              >
                ← Back
              </button>
              <button
                disabled={!selectedElf || loading}
                onClick={submit}
                className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-8 py-4 text-lg font-extrabold text-white shadow-2xl ring-2 ring-yellow-400/80 transition enabled:hover:scale-105 disabled:opacity-40"
              >
                {loading
                  ? "Sending magic to the North Pole... ✨"
                  : selectedElf
                    ? `Become Pen Pals with ${selectedElf.name}! 💌`
                    : "Pick an elf first! 🧝"}
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="mt-10 rounded-3xl bg-white/95 p-8 text-center shadow-2xl ring-4 ring-yellow-400/60">
            <div className="text-6xl">🎉</div>
            <h1 className="mt-2 text-3xl font-extrabold text-emerald-900">
              Welcome to the North Pole, {firstName}!
            </h1>
            <p className="mt-2 text-slate-600">
              {selectedElf?.name} is already writing your first letter! Here is your{" "}
              <b>Magic Code</b> — it&apos;s how you log in. Ask a grown-up to keep it safe!
            </p>
            <div className="mx-auto mt-4 w-fit rounded-2xl bg-emerald-900 px-8 py-4 text-3xl font-extrabold tracking-widest text-yellow-300 shadow-inner">
              {magicCode}
            </div>
            <button
              onClick={() => router.push("/kid")}
              className="mt-6 rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-10 py-4 text-xl font-extrabold text-white shadow-lg ring-2 ring-yellow-400/70 transition hover:scale-105"
            >
              Open My Magical Dashboard! 🎄
            </button>
          </div>
        )}
      </div>
    </main>
  );
}