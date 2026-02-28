"use client";

import { cn } from "@/lib/utils";

export type WordStatus = "clean" | "warn" | "ghost" | "fixed";

interface WordChipProps {
  id: string;
  word: string;
  score: number;
  status: WordStatus;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function WordChip({ id, word, score, status, selected, onSelect }: WordChipProps) {
  const variants = {
    clean: "bg-green-500/10 border-green-500/25 text-green-200/80",
    warn: "bg-accent/10 border-accent/25 text-accent/80",
    ghost: "bg-primary/10 border-primary/25 text-primary/80 animate-flicker",
    fixed: "bg-green-500/20 border-green-500/50 text-green-400",
  };

  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "inline-flex flex-col items-center px-2 py-0.5 rounded-sm transition-transform hover:-translate-y-0.5 border",
        variants[status] || variants.clean,
        selected && "border-primary bg-primary/20 shadow-[0_0_8px_rgba(174,27,20,0.25)] scale-105 z-10"
      )}
      title={`${score}% clarity`}
    >
      <span className="font-headline text-sm tracking-wide">{word}</span>
      <span className="font-body text-[7px] tracking-widest opacity-50">{score}%</span>
    </button>
  );
}
