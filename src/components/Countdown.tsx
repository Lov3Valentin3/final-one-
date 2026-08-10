"use client";
import { useEffect, useState } from "react";
function nextChristmas(): Date {
  const now = new Date();
  let year = now.getFullYear();
  const xmas = new Date(year, 11, 25);
  if (now > new Date(year, 11, 25, 23, 59, 59)) year += 1;
  return new Date(year, 11, 25);
}
export default function Countdown() {
  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  useEffect(() => {
    const tick = () => {
      const target = nextChristmas().getTime();
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const cells = [
    { label: "Days", value: time?.days },
    { label: "Hours", value: time?.hours },
    { label: "Minutes", value: time?.minutes },
    { label: "Seconds", value: time?.seconds },
  ];
  return (
    <div className="rounded-2xl bg-gradient-to-br from-red-700 to-red-900 p-4 text-center text-white shadow-lg ring-2 ring-yellow-400/60">
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-yellow-300">
        🎄 Countdown to Christmas 🎄
      </p>
      <div className="grid grid-cols-4 gap-2">
        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-xl bg-white/10 p-2 backdrop-blur-sm"
          >
            <div className="text-2xl font-extrabold tabular-nums sm:text-3xl">
              {c.value ?? "–"}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-red-100">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}