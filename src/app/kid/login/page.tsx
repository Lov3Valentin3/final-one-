"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Snow from "@/components/Snow";
import { TwinkleLights } from "@/components/Festive";
export default function KidLogin() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/kid/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ magicCode: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "That code didn't work.");
      return;
    }
    router.push("/kid");
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <Snow count={24} />
      <div className="absolute top-0 w-full"><TwinkleLights /></div>
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl ring-4 ring-yellow-400/50">
        <div className="text-center text-5xl">🔑</div>
        <h1 className="mt-2 text-center text-3xl font-extrabold text-emerald-900">
          Kid Login
        </h1>
        <p className="mt-1 text-center text-slate-500">
          Type your <b>Magic Code</b> to open your North Pole mailbox!
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. JINGLE-1234"
            className="w-full rounded-xl border-2 border-emerald-200 p-4 text-center text-xl font-extrabold tracking-widest outline-none focus:border-red-500"
          />
          {error && (
            <p className="rounded-xl bg-red-100 p-3 text-center text-sm font-bold text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={loading || !code.trim()}
            className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 py-4 text-xl font-extrabold text-white shadow-lg ring-2 ring-yellow-400/70 transition enabled:hover:scale-[1.02] disabled:opacity-40"
          >
            {loading ? "Checking Santa's book... 📖" : "Open My Mailbox! 💌"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No magic code yet?{" "}
          <Link href="/kid/register" className="font-bold text-red-600 hover:underline">
            Meet your elf!
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Lost your code? A parent can find it in the Parent Portal.
        </p>
      </div>
    </main>
  );
}