"use client";
import { useEffect, useState } from "react";
type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
};
export default function Snow({ count = 36 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  useEffect(() => {
    const chars = ["❄", "❅", "❆", "•"];
    setFlakes(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 14,
        duration: 8 + Math.random() * 14,
        delay: -Math.random() * 20,
        char: chars[Math.floor(Math.random() * chars.length)],
      }))
    );
  }, [count]);
  return (
    <div aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}vw`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: 0.4 + (f.size - 8) / 20,
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}