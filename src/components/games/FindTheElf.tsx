"use client";
import { useEffect, useState } from "react";
const DECOYS = ["🎄", "⛄", "🎁", "🌲", "🏠", "🛷"];
export default function FindTheElf({
  onAchievement,
}: {
  onAchievement: (key: string, title: string) => void;
}) {
  const [grid, setGrid] = useState<string[]>([]);
  const [elfIndex, setElfIndex] = useState(-1);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(0);
  function newRound(nextRound: number) {
    const size = Math.min(24 + nextRound * 8, 64);
    const cells = Array.from(
      { length: size },
      () => DECOYS[Math.floor(Math.random() * DECOYS.length)]
    );
    const idx = Math.floor(Math.random() * size);
    cells[idx] = "🧝";
    setGrid(cells);
    setElfIndex(idx);
    setRound(nextRound);
    setMessage("");
    setStartTime(Date.now());
  }
  useEffect(() => newRound(1), []);
  function click(i: number) {
    if (i === elfIndex) {
      const secs = ((Date.now() - startTime) / 1000).toFixed(1);
      if (round >= 5) {
        setMessage(`🎉 Round ${round} done in ${secs}s — you found ALL the hidden elves!`);
        onAchievement("elf-finder", "Master Elf Finder 🔍");
        setTimeout(() => newRound(1), 2000);
      } else {
        setMessage(`✨ Found in ${secs}s! Next round — the forest grows...`);
        setTimeout(() => newRound(round + 1), 1200);
      }
    } else {
      setMessage("❄️ Brrr, not there! Keep looking...");
    }
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold text-emerald-900">Round {round} of 5 — find the hiding elf! 🧝</p>
      </div>
      {message && (
        <p className="mb-3 rounded-xl bg-yellow-100 p-2 text-center text-sm font-bold text-yellow-800">
          {message}
        </p>
      )}
      <div className="grid grid-cols-8 gap-1">
        {grid.map((cell, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className="flex aspect-square items-center justify-center rounded-lg bg-emerald-50 text-lg transition hover:scale-110 hover:bg-emerald-100 sm:text-xl"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}