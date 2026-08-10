"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Snow from "@/components/Snow";
import Countdown from "@/components/Countdown";
import { ElfAvatar, TwinkleLights } from "@/components/Festive";
import MemoryGame from "@/components/games/MemoryGame";
import TriviaGame from "@/components/games/TriviaGame";
import FindTheElf from "@/components/games/FindTheElf";
import { ELF_VIDEOS } from "@/lib/videos";
import { CERTIFICATES, quoteOfTheDay } from "@/lib/content";
import type { Elf } from "@/lib/elves";
type Child = {
  id: number;
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  magicCode: string;
  paused: boolean;
};
type Letter = {
  id: number;
  sender: string;
  body: string;
  createdAt: string;
};
type Cert = { id: number; certKey: string; unlockedAt: string };
type Achievement = { id: number; key: string; title: string };
const TABS = [
  { id: "write", label: "✍️ Write a Letter" },
  { id: "inbox", label: "📬 Inbox" },
  { id: "videos", label: "🎬 Elf Videos" },
  { id: "games", label: "🎮 Games" },
  { id: "certs", label: "📜 Certificates" },
] as const;
export default function KidDashboard() {
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [elf, setElf] = useState<Elf | null>(null);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [lettersList, setLettersList] = useState<Letter[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("write");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [game, setGame] = useState<"memory" | "trivia" | "find" | null>(null);
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const loadAll = useCallback(async () => {
    const [meRes, lettersRes] = await Promise.all([
      fetch("/api/kid/me"),
      fetch("/api/kid/letters"),
    ]);
    if (meRes.status === 401) {
      router.push("/kid/login");
      return;
    }
    const me = await meRes.json();
    const l = await lettersRes.json();
    setChild(me.child);
    setElf(me.elf);
    setCerts(me.certificates);
    setAchievements(me.achievements);
    setLettersList(l.letters ?? []);
  }, [router]);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }
  async function sendLetter() {
    if (!draft.trim() || sending) return;
    setSending(true);
    const res = await fetch("/api/kid/letters", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      showToast(data.error ?? "Oops! Try again.");
      return;
    }
    setDraft("");
    await loadAll();
    if (data.replied) {
      showToast(`💌 ${elf?.name} wrote back already! Check your inbox!`);
      setTab("inbox");
    } else {
      showToast("💌 Your letter is flying to the North Pole!");
    }
    if (data.unlocked?.length) {
      setTimeout(
        () => showToast("🏅 You unlocked a new certificate! Check the Certificates tab!"),
        4200
      );
    }
  }
  const awardAchievement = useCallback(
    async (key: string, title: string) => {
      const res = await fetch("/api/kid/achievements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, title }),
      });
      const data = await res.json();
      if (data.isNew) showToast(`🏅 New badge earned: ${title}`);
      await loadAll();
    },
    [loadAll]
  );
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }
  if (!child || !elf) {
    return (
      <main className="relative flex min-h-screen items-center justify-center">
        <Snow count={20} />
        <p className="animate-pulse text-2xl font-extrabold text-white">
          ❄️ Opening the workshop doors...
        </p>
      </main>
    );
  }
  const elfLetters = lettersList.filter((l) => l.sender !== "child");
  return (
    <main className="relative min-h-screen pb-16">
      <Snow count={24} />
      <TwinkleLights />
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-yellow-400 px-6 py-3 font-extrabold text-emerald-950 shadow-2xl">
          {toast}
        </div>
      )}
      {/* Header */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-6">
        <div className="flex items-center gap-3">
          <ElfAvatar elf={elf} size="sm" />
          <div>
            <h1 className="text-xl font-extrabold text-white sm:text-2xl">
              Hi {child.firstName}! 👋
            </h1>
            <p className="text-sm text-emerald-100/80">
              Your pen pal <b className="text-yellow-300">{elf.name}</b> ·{" "}
              {elf.job}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100 sm:inline">
            🔑 {child.magicCode}
          </span>
          <button
            onClick={logout}
            className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/25"
          >
            Log out
          </button>
        </div>
      </header>
      {/* Countdown + quote */}
      <section className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <Countdown />
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-4 text-center text-white shadow-lg ring-2 ring-yellow-400/60">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
            ⭐ Today&apos;s Christmas Magic
          </p>
          <p className="font-hand mt-2 text-xl">{quoteOfTheDay()}</p>
        </div>
      </section>
      {/* Tabs */}
      <nav className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition sm:px-5 ${
              tab === t.id
                ? "bg-yellow-400 text-emerald-950 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {t.label}
            {t.id === "inbox" && elfLetters.length > 0 && (
              <span className="ml-1.5 rounded-full bg-red-600 px-1.5 text-xs text-white">
                {elfLetters.length}
              </span>
            )}
          </button>
        ))}
      </nav>
      <section className="mx-auto mt-4 max-w-6xl px-4">
        {/* WRITE */}
        {tab === "write" && (
          <div className="rounded-3xl bg-white/95 p-6 shadow-2xl ring-4 ring-yellow-400/40">
            <h2 className="text-2xl font-extrabold text-emerald-900">
              ✍️ Write to {elf.name}
            </h2>
            <p className="text-sm text-slate-500">
              Tell {elf.name} about your day, your wishes, your pets — anything!
              {child.paused && (
                <span className="ml-1 font-bold text-red-600">
                  (Letters are paused right now — a grown-up can turn them back on.)
                </span>
              )}
            </p>
            <div className="letter-paper mt-4 rounded-xl p-4 ring-1 ring-amber-200">
              <p className="font-hand text-lg text-slate-700">Dear {elf.name},</p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={8}
                placeholder="Write your magical letter here..."
                className="font-hand nice-scroll mt-1 w-full resize-none bg-transparent text-lg leading-8 text-slate-800 outline-none placeholder:text-slate-400"
              />
              <p className="font-hand text-lg text-slate-700">
                Your friend, {child.firstName}
              </p>
            </div>
            <button
              onClick={sendLetter}
              disabled={sending || !draft.trim()}
              className="mt-4 w-full rounded-2xl bg-gradient-to-b from-red-500 to-red-700 py-4 text-xl font-extrabold text-white shadow-lg ring-2 ring-yellow-400/70 transition enabled:hover:scale-[1.01] disabled:opacity-40"
            >
              {sending
                ? "🦉 A snow owl is carrying your letter north..."
                : "Send My Letter to the North Pole! 💌"}
            </button>
          </div>
        )}
        {/* INBOX */}
        {tab === "inbox" && (
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              📬 Your Magical Mailbox
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {lettersList.length === 0 && (
                <p className="text-emerald-100/80">
                  No letters yet — write your first one!
                </p>
              )}
              {[...lettersList].reverse().map((l) => (
                <button
                  key={l.id}
                  onClick={() => setOpenLetter(l)}
                  className={`envelope-shadow rounded-2xl p-4 text-left transition hover:-translate-y-1 ${
                    l.sender === "child"
                      ? "bg-emerald-50"
                      : "letter-paper"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">
                      {l.sender === "child" ? "📤" : "💌"}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 font-extrabold text-emerald-900">
                    {l.sender === "child"
                      ? `To ${elf.name} (from you)`
                      : `From ${elf.name} ${elf.emoji}`}
                  </p>
                  <p className="font-hand mt-1 line-clamp-2 text-sm text-slate-600">
                    {l.body}
                  </p>
                  <p className="mt-2 text-xs font-bold text-red-600">
                    Open envelope →
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* VIDEOS */}
        {tab === "videos" && (
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              🎬 Videos From {elf.name}
            </h2>
            <p className="text-sm text-emerald-100/80">
              {elf.name} sends you magical peeks of North Pole life!
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ELF_VIDEOS.map((v) => (
                <div
                  key={v.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-xl"
                >
                  {playingVideo === v.id ? (
                    <video
                      src={v.url}
                      controls
                      autoPlay
                      className="aspect-video w-full bg-black object-cover"
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingVideo(v.id)}
                      className="group relative block aspect-video w-full"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.thumb}
                        alt={v.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-5xl transition group-hover:bg-black/10">
                        ▶️
                      </span>
                    </button>
                  )}
                  <div className="p-4">
                    <p className="font-extrabold text-emerald-900">
                      {v.emoji} {v.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-white/10 p-3 text-center text-sm text-emerald-100/80">
              ✨ Coming soon: videos where {elf.name} says YOUR name! Parents can
              add this in the Parent Portal.
            </p>
          </div>
        )}
        {/* GAMES */}
        {tab === "games" && (
          <div>
            <h2 className="text-2xl font-extrabold text-white">🎮 North Pole Arcade</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {achievements.map((a) => (
                <span
                  key={a.id}
                  className="rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-extrabold text-emerald-950"
                >
                  🏅 {a.title}
                </span>
              ))}
              {achievements.length === 0 && (
                <span className="text-sm text-emerald-100/70">
                  Play games to earn badges and unlock certificates!
                </span>
              )}
            </div>
            {!game ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { id: "memory" as const, emoji: "🧠", title: "Santa Memory Game", desc: "Match the Christmas pairs!", ready: true },
                  { id: "trivia" as const, emoji: "🎓", title: "Elf Trivia", desc: "8 questions from Toy University!", ready: true },
                  { id: "find" as const, emoji: "🔍", title: "Find the Elf", desc: "An elf is hiding in the forest!", ready: true },
                  { id: null, emoji: "🌀", title: "Elf Maze", desc: "Coming soon!", ready: false },
                  { id: null, emoji: "🎨", title: "Christmas Coloring", desc: "Coming soon!", ready: false },
                  { id: null, emoji: "🔤", title: "Word Search", desc: "Coming soon!", ready: false },
                ].map((g, i) => (
                  <button
                    key={i}
                    disabled={!g.ready}
                    onClick={() => g.id && setGame(g.id)}
                    className={`rounded-2xl p-6 text-left shadow-xl transition ${
                      g.ready
                        ? "bg-white hover:-translate-y-1"
                        : "bg-white/40 opacity-70"
                    }`}
                  >
                    <div className="text-4xl">{g.emoji}</div>
                    <p className="mt-2 font-extrabold text-emerald-900">{g.title}</p>
                    <p className="text-sm text-slate-500">{g.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-3xl bg-white/95 p-6 shadow-2xl">
                <button
                  onClick={() => setGame(null)}
                  className="mb-4 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-900 hover:bg-emerald-200"
                >
                  ← All games
                </button>
                {game === "memory" && <MemoryGame onAchievement={awardAchievement} />}
                {game === "trivia" && <TriviaGame onAchievement={awardAchievement} />}
                {game === "find" && <FindTheElf onAchievement={awardAchievement} />}
              </div>
            )}
          </div>
        )}
        {/* CERTIFICATES */}
        {tab === "certs" && (
          <div>
            <h2 className="text-2xl font-extrabold text-white">📜 Your Certificates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CERTIFICATES.map((def) => {
                const owned = certs.find((c) => c.certKey === def.key);
                return (
                  <div
                    key={def.key}
                    className={`rounded-2xl p-5 shadow-xl ${
                      owned
                        ? "bg-gradient-to-br from-yellow-50 to-amber-100 ring-4 ring-yellow-400"
                        : "bg-white/40"
                    }`}
                  >
                    <div className="text-4xl">{owned ? def.emoji : "🔒"}</div>
                    <p className="mt-2 font-extrabold text-emerald-900">{def.title}</p>
                    <p className="text-xs text-slate-600">{def.description}</p>
                    {owned ? (
                      <a
                        href={`/certificate/${def.key}`}
                        className="mt-3 inline-block rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-red-700"
                      >
                        View &amp; Print 🖨️
                      </a>
                    ) : (
                      <p className="mt-3 text-xs font-bold text-slate-500">
                        {def.premium ? "⭐ Ask a parent to unlock" : `How: ${def.requirement}`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
      {/* Letter modal */}
      {openLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpenLetter(null)}
        >
          <div
            className="letter-paper envelope-shadow max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 nice-scroll sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                North Pole Express Mail
              </span>
              <button
                onClick={() => setOpenLetter(null)}
                className="rounded-full bg-slate-200 px-3 py-1 text-sm font-bold hover:bg-slate-300"
              >
                ✕
              </button>
            </div>
            <p className="font-hand mt-4 whitespace-pre-wrap text-lg leading-8 text-slate-800">
              {openLetter.body}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
