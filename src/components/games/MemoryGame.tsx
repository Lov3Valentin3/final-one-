"use client";
import { useEffect, useState } from "react";
const EMOJIS = ["🎅", "🦌", "🎁", "⛄", "🎄", "🍬", "⭐", "🔔"];
type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export default function MemoryGame({
  onAchievement,
}: {
  onAchievement: (key: string, title: string) => void;
}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  function reset() {
    setCards(
      shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      }))
    );
    setPicked([]);
    setMoves(0);
    setWon(false);
  }
  useEffect(() => reset(), []);
  function flip(id: number) {
    if (picked.length === 2 || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nowPicked = [...picked, id];
    setCards(next);
    setPicked(nowPicked);
    if (nowPicked.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nowPicked.map((pid) => next.find((c) => c.id === pid)!);
      setTimeout(() => {
        if (a.emoji === b.emoji) {
          const matched = next.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
          );
          setCards(matched);
          if (matched.every((c) => c.matched)) {
            setWon(true);
            onAchievement("memory-master", "Santa Memory Master 🧠");
          }
        } else {
          setCards(
            next.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
            )
          );
        }
        setPicked([]);
      }, 700);
    }
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold text-emerald-900">Moves: {moves}</p>
        <button
          onClick={reset}
          className="rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-800"
        >
          🔄 Restart
        </button>
      </div>
      {won && (
        <div className="mb-3 rounded-xl bg-yellow-100 p-3 text-center font-extrabold text-yellow-800 ring-2 ring-yellow-400">
          🎉 You matched them all in {moves} moves! Achievement unlocked!
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            className={`flex aspect-square items-center justify-center rounded-xl text-3xl transition-all sm:text-4xl ${
              c.flipped || c.matched
                ? "bg-white ring-2 ring-emerald-400"
                : "candy-stripe hover:scale-105"
            } ${c.matched ? "opacity-60" : ""}`}
          >
            {(c.flipped || c.matched) && c.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
