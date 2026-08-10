import type { Elf } from "@/lib/elves";
export function TwinkleLights() {
  const colors = [
    "text-red-400",
    "text-yellow-300",
    "text-green-400",
    "text-blue-300",
    "text-pink-400",
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none flex w-full justify-between overflow-hidden px-2 py-1"
    >
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} className={`twinkle text-xs ${colors[i % colors.length]}`}>
          ●
        </span>
      ))}
    </div>
  );
}
export function ElfAvatar({
  elf,
  size = "md",
}: {
  elf: Elf;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-12 w-12 text-2xl",
    md: "h-20 w-20 text-4xl",
    lg: "h-28 w-28 text-6xl",
  };
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${elf.accent} ${sizes[size]} shadow-lg ring-4 ring-white/70`}
    >
      <span className="absolute -top-2 text-lg" aria-hidden>
        {elf.gender === "girl" ? "🧝‍♀️" : "🧝‍♂️"}
      </span>
      <span aria-hidden>{elf.emoji}</span>
    </div>
  );
}
