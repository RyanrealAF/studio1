
"use client";

import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end p-8 lg:p-16 overflow-hidden border-b border-white/5 bg-background">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(174,27,20,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(225,177,53,0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
      
      <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 font-headline text-[25vw] leading-[0.85] text-primary/[0.03] select-none pointer-events-none whitespace-nowrap">
        VS
      </div>

      <div className="relative z-10 space-y-8 max-w-5xl">
        <div className="flex items-center gap-4 text-accent">
          <div className="h-[1px] w-8 bg-accent" />
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold">
            buildwhilebleeding.com · Unified Build Manifesto
          </span>
        </div>

        <h2 className="font-headline text-7xl lg:text-[11rem] leading-[0.88] tracking-tight text-foreground">
          VOCAL<br />
          <span className="text-primary">SURGEON</span>
        </h2>

        <p className="font-editorial italic text-xl lg:text-3xl text-muted-foreground max-w-2xl leading-relaxed">
          A tool built on a single conviction: the words were already known. Everything else is surgery.
        </p>

        <div className="flex flex-wrap gap-2 pt-8">
          {[
            { label: "Lyrics-First", variant: "destructive" },
            { label: "Forced Alignment", variant: "destructive" },
            { label: "Firebase", variant: "secondary" },
            { label: "Genkit AI", variant: "outline" },
            { label: "WhisperX", variant: "outline" },
          ].map((tag) => (
            <Badge 
              key={tag.label} 
              variant={tag.variant as any}
              className="px-3 py-1 text-[10px] tracking-widest uppercase border-white/10"
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
