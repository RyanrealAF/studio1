
"use client";

import { cn } from "@/lib/utils";

interface ManifestoSectionProps {
  id: string;
  num: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ManifestoSection({ id, num, eyebrow, title, children, className }: ManifestoSectionProps) {
  return (
    <section id={id} className={cn("py-20 lg:py-32 border-t border-white/5 animate-fade-in-up", className)}>
      <div className="flex items-center gap-4 text-primary mb-8">
        <span className="text-[11px] tracking-[0.45em] uppercase font-bold">
          {num} · {eyebrow}
        </span>
        <div className="h-[1px] flex-1 bg-primary/20" />
      </div>

      <h3 className="font-headline text-4xl lg:text-7xl leading-none mb-12 text-foreground tracking-tight">
        {title}
      </h3>

      <div className="max-w-3xl space-y-6 text-muted-foreground text-lg leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function ManifestoQuote({ children, cite }: { children: React.ReactNode; cite: string }) {
  return (
    <div className="relative my-16 p-10 lg:p-16 bg-gradient-to-br from-primary/[0.06] to-accent/[0.04] border-y border-primary/20 -mx-8 lg:-mx-16 overflow-hidden">
      <div className="absolute top-0 left-6 text-primary/10 font-editorial text-9xl leading-none pointer-events-none select-none">
        “
      </div>
      <div className="relative z-10 space-y-6">
        <p className="font-editorial italic text-2xl lg:text-3xl text-foreground max-w-2xl leading-relaxed">
          {children}
        </p>
        <cite className="block text-[10px] tracking-[0.35em] uppercase text-primary font-bold not-italic">
          — {cite}
        </cite>
      </div>
    </div>
  );
}

export function Callout({ type = "gold", label, children }: { type?: 'gold' | 'red' | 'green' | 'blue'; label: string; children: React.ReactNode }) {
  const colors = {
    gold: "border-accent bg-accent/5 text-accent",
    red: "border-primary bg-primary/5 text-primary",
    green: "border-green-500 bg-green-500/5 text-green-500",
    blue: "border-blue-500 bg-blue-500/5 text-blue-500",
  };

  return (
    <div className={cn("border-l-2 p-8 my-10 rounded-r-sm", colors[type])}>
      <span className="block text-[10px] tracking-[0.38em] uppercase font-bold mb-4">
        {label}
      </span>
      <div className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
