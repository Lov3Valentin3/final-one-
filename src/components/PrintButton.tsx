"use client";
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-red-600 px-6 py-2 font-bold text-white shadow hover:bg-red-700"
    >
      🖨️ Print Certificate
    </button>
  );
}