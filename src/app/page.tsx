import Link from "next/link";
import Snow from "@/components/Snow";
import Countdown from "@/components/Countdown";
import { TwinkleLights, ElfAvatar } from "@/components/Festive";
import { ELVES } from "@/lib/elves";
import { quoteOfTheDay, PLANS } from "@/lib/content";
export default function LandingPage() {
  const featuredElves = [ELVES[0], ELVES[10], ELVES[5], ELVES[12], ELVES[3], ELVES[16]];
  return (
    <main className="relative overflow-hidden">
      <Snow />
      <TwinkleLights />
      {/* HERO */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/north-pole-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-950/40 to-emerald-950" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 text-center text-white">
          <p className="mb-3 inline-block rounded-full bg-red-700/80 px-4 py-1 text-sm font-bold tracking-wide ring-2 ring-yellow-400/70">
            ✨ Direct from Santa&apos;s Workshop ✨
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-6xl">
            Your Very Own{" "}
            <span className="text-yellow-300">North Pole Elf</span> Pen Pal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-50/90">
            Write letters to a real North Pole elf who remembers everything
            about you — and writes back with magic, jokes, and workshop
            secrets. For dreamers ages 3–12. 🎄
          </p>
          {/* The waiting letter */}
          <div className="mx-auto mt-10 max-w-xl rotate-[-1deg]">
            <div className="letter-paper envelope-shadow rounded-lg p-6 text-left text-slate-800 sm:p-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xl">💌</span>
                <span className="rounded bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  North Pole Express Mail
                </span>
              </div>
              <p className="font-hand text-lg leading-8">
                Dear Friend,
                <br />
                Hello from the North Pole! My name is written in frost on the
                envelope — but you&apos;ll find out when you pick me! I&apos;ve
                been waiting ALL YEAR for a pen pal exactly like you. Santa
                says you&apos;re one of the kindest kids on the whole Nice
                List. Will you be my pen pal? Write back soon — the reindeer
                are waiting to deliver your first letter!
              </p>
              <p className="font-hand mt-3 text-lg">
                Sparkles &amp; snowflakes,
                <br />
                Your Future Elf Best Friend 🧝✨
              </p>
            </div>
          </div>
          {/* Big buttons */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/kid/register"
              className="wiggle rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-6 py-5 text-xl font-extrabold text-white shadow-xl ring-4 ring-yellow-400/60 transition hover:scale-105"
            >
              🧒 Kid Register — Meet Your Elf!
            </Link>
            <Link
              href="/kid/login"
              className="wiggle rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 px-6 py-5 text-xl font-extrabold text-white shadow-xl ring-4 ring-yellow-400/60 transition hover:scale-105"
            >
              🔑 Kid Login
            </Link>
            <Link
              href="/parent/register"
              className="rounded-2xl bg-white/90 px-6 py-4 text-lg font-bold text-emerald-900 shadow-lg transition hover:scale-105"
            >
              👨‍👩‍👧 Parent Register
            </Link>
            <Link
              href="/parent/login"
              className="rounded-2xl bg-white/20 px-6 py-4 text-lg font-bold text-white ring-2 ring-white/60 backdrop-blur transition hover:scale-105"
            >
              🔐 Parent Login
            </Link>
          </div>
        </div>
      </section>
      {/* COUNTDOWN + QUOTE */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2">
        <Countdown />
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-center text-white shadow-lg ring-2 ring-yellow-400/60">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
            ⭐ Today&apos;s Christmas Magic ⭐
          </p>
          <p className="font-hand mt-3 text-2xl">{quoteOfTheDay()}</p>
        </div>
      </section>
      {/* MEET THE ELVES */}
      <section className="mx-auto max-w-6xl px-4 py-10 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Choose From <span className="text-yellow-300">20 Magical Elves</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-emerald-100/80">
          Every elf has their own personality, North Pole job, favorite treats
          and hilarious stories. Which one will be YOUR best friend?
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featuredElves.map((elf) => (
            <div
              key={elf.id}
              className="float-slow flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            >
              <ElfAvatar elf={elf} />
              <p className="font-bold text-white">{elf.name}</p>
              <p className="text-xs text-emerald-100/70">{elf.job}</p>
            </div>
          ))}
        </div>
        <Link
          href="/kid/register"
          className="mt-8 inline-block rounded-full bg-yellow-400 px-8 py-3 text-lg font-extrabold text-emerald-950 shadow-lg transition hover:scale-105"
        >
          Meet All 20 Elves →
        </Link>
      </section>
      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-3xl font-extrabold text-white">
          A Whole World of{" "}
          <span className="text-yellow-300">Christmas Magic</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["✉️", "Magical Letters", "Your elf writes back with jokes, workshop news and questions — and remembers every letter you send."],
            ["🎬", "Videos From Your Elf", "Peek inside Santa's workshop, watch the reindeer play and see snow fall at the North Pole."],
            ["🎮", "Mini Games & Badges", "Santa Memory, Elf Trivia, Word Search and more — earn achievements and badges!"],
            ["📜", "Printable Certificates", "Unlock the Official Friend of the North Pole, Nice List Certificate and more."],
            ["🛡️", "Parents in Control", "Read every letter, approve replies, pause anytime. AI, parent-written, or both."],
            ["⏰", "Christmas Countdown", "A live countdown and a new inspirational Christmas quote every single day."],
          ].map(([emoji, title, desc]) => (
            <div
              key={title}
              className="rounded-2xl bg-white/10 p-6 text-white backdrop-blur-sm ring-1 ring-white/10 transition hover:bg-white/15"
            >
              <div className="text-4xl">{emoji}</div>
              <h3 className="mt-2 text-xl font-bold text-yellow-200">{title}</h3>
              <p className="mt-1 text-sm text-emerald-50/80">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* PLANS PREVIEW */}
      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-3xl font-extrabold text-white">
          Simple Plans for{" "}
          <span className="text-yellow-300">Magical Families</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className="rounded-2xl bg-white p-6 shadow-xl ring-4 ring-yellow-400/40"
            >
              <div className="text-4xl">{plan.emoji}</div>
              <h3 className="mt-1 text-xl font-extrabold text-emerald-900">
                {plan.title}
              </h3>
              <p className="mt-1 text-3xl font-extrabold text-red-700">
                ${(plan.priceCents / 100).toFixed(2)}
                <span className="text-sm font-semibold text-slate-500">
                  {plan.period}
                </span>
              </p>
              <ul className="mt-3 space-y-1 text-left text-sm text-slate-600">
                {plan.perks.map((p) => (
                  <li key={p}>🎁 {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/parent/register"
          className="mt-8 inline-block rounded-full bg-red-600 px-8 py-3 text-lg font-extrabold text-white shadow-lg ring-2 ring-yellow-400/60 transition hover:scale-105"
        >
          Start Free — Parent Sign Up
        </Link>
      </section>
      <footer className="border-t border-white/10 py-10 text-center text-sm text-emerald-100/60">
        <TwinkleLights />
        <p className="mt-4 px-4">
          North Pole Pen Pals — Elf Pen Pal letters from the North Pole, Santa
          letters, Christmas games &amp; magic for kids. Safe, ad-free and
          parent-approved. 🎅❄️
        </p>
        <p className="mt-2">© {new Date().getFullYear()} North Pole Pen Pals · Made with ❤️ and cocoa</p>
      </footer>
    </main>
  );
}