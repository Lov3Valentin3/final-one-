"use client";
import { useState } from "react";
const QUESTIONS = [
  {
    q: "What do elves make in Santa's workshop?",
    options: ["Toys", "Pizza", "Cars", "Homework"],
    answer: 0,
  },
  {
    q: "Which reindeer has a glowing red nose?",
    options: ["Dasher", "Rudolph", "Comet", "Blitzen"],
    answer: 1,
  },
  {
    q: "What do kids leave out for Santa on Christmas Eve?",
    options: ["Broccoli", "Cookies and milk", "Spaghetti", "Ice cubes"],
    answer: 1,
  },
  {
    q: "Where does Santa live?",
    options: ["The beach", "The South Pole", "The North Pole", "The moon"],
    answer: 2,
  },
  {
    q: "What do elves like to wear on their feet?",
    options: ["Flippers", "Roller skates", "Curly pointed shoes", "Flip flops"],
    answer: 2,
  },
  {
    q: "How does Santa get into houses?",
    options: ["Down the chimney", "Through the fridge", "By taxi", "The doggy door"],
    answer: 0,
  },
  {
    q: "What pulls Santa's sleigh?",
    options: ["Horses", "Flying reindeer", "Penguins", "Polar bears"],
    answer: 1,
  },
  {
    q: "What is a favorite North Pole drink?",
    options: ["Hot chocolate", "Pickle juice", "Cold soup", "Mud water"],
    answer: 0,
  },
];
export default function TriviaGame({
  onAchievement,
}: {
  onAchievement: (key: string, title: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const question = QUESTIONS[idx];
  function choose(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    const correct = i === question.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) {
        setDone(true);
        const finalScore = score + (correct ? 1 : 0);
        onAchievement("trivia-player", "Elf Trivia Explorer 🎓");
        if (finalScore === QUESTIONS.length) {
          onAchievement("trivia-perfect", "Elf Trivia Champion 🏆");
        }
      } else {
        setIdx((v) => v + 1);
        setChosen(null);
      }
    }, 900);
  }
  function restart() {
    setIdx(0);
    setScore(0);
    setChosen(null);
    setDone(false);
  }
  if (done) {
    return (
      <div className="text-center">
        <div className="text-5xl">{score === QUESTIONS.length ? "🏆" : "🎓"}</div>
        <p className="mt-2 text-2xl font-extrabold text-emerald-900">
          You scored {score} / {QUESTIONS.length}!
        </p>
        <p className="text-slate-500">
          {score === QUESTIONS.length
            ? "PERFECT! You're an honorary elf now!"
            : "Great job! Play again to become an Elf Trivia Champion!"}
        </p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700"
        >
          Play Again 🔄
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm font-bold text-emerald-800">
        <span>Question {idx + 1} of {QUESTIONS.length}</span>
        <span>⭐ Score: {score}</span>
      </div>
      <p className="rounded-xl bg-emerald-50 p-4 text-lg font-extrabold text-emerald-900">
        {question.q}
      </p>
      <div className="mt-3 grid gap-2">
        {question.options.map((opt, i) => {
          let cls = "bg-white ring-2 ring-emerald-200 hover:ring-emerald-500";
          if (chosen !== null) {
            if (i === question.answer) cls = "bg-green-100 ring-2 ring-green-500";
            else if (i === chosen) cls = "bg-red-100 ring-2 ring-red-500";
            else cls = "bg-white ring-1 ring-slate-200 opacity-60";
          }
          return (
            <button
              key={opt}
              onClick={() => choose(i)}
              className={`rounded-xl p-3 text-left font-bold text-slate-700 transition ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}