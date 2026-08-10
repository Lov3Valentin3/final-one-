"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Snow from "@/components/Snow";
export default function ParentRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/parent/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/parent");
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <Snow count={20} />
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl ring-4 ring-emerald-500/40">
        <div className="text-center text-5xl">👨‍👩‍👧</div>
        <h1 className="mt-2 text-center text-3xl font-extrabold text-emerald-900">
          Parent Register
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Full visibility &amp; control of your child&apos;s magical pen pal.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border-2 border-emerald-200 p-3 outline-none focus:border-emerald-600"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-xl border-2 border-emerald-200 p-3 outline-none focus:border-emerald-600"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            className="w-full rounded-xl border-2 border-emerald-200 p-3 outline-none focus:border-emerald-600"
          />
          {error && (
            <p className="rounded-xl bg-red-100 p-3 text-center text-sm font-bold text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="rounded-2xl bg-emerald-700 py-3.5 text-lg font-extrabold text-white shadow-lg transition enabled:hover:scale-[1.02] disabled:opacity-40"
          >
            {loading ? "Creating account..." : "Create Free Account 🎄"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/parent/login" className="font-bold text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
