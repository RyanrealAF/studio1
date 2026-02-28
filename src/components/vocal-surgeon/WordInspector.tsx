"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Check, Flag, Zap, Play } from "lucide-react";
import { WordStatus } from "./WordChip";

interface WordData {
  id: string;
  word: string;
  score: number;
  status: WordStatus;
  timestamp: number;
  sectionName?: string;
  ghostReason?: string | null;
}

interface WordInspectorProps {
  wordData: WordData | null;
  onApprove: () => void;
  onFlag: () => void;
  onFix: () => void;
  onIsolate: () => void;
}

export function WordInspector({ wordData, onApprove, onFlag, onFix, onIsolate }: WordInspectorProps) {
  if (!wordData) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-sm p-12 text-center">
        <h4 className="font-headline text-4xl text-white/5 tracking-widest">SELECT A WORD</h4>
        <p className="font-body text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] mt-2">
          Click any word token to inspect frequencies
        </p>
      </div>
    );
  }

  const { word, score, status, sectionName, timestamp, ghostReason } = wordData;
  const ghostEnergy = Math.max(0, 100 - score - Math.floor(Math.random() * 10));
  
  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-500";
    if (s >= 40) return "text-accent";
    return "text-primary";
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Card className="bg-white/[0.02] border-white/10 rounded-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={cn("font-headline text-5xl tracking-tight leading-none uppercase", status === "fixed" ? "text-green-500" : "text-primary")}>
                {word}
              </h2>
              <p className="font-body text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-2">
                {sectionName || "TIMELINE"} · {Math.floor(timestamp / 60)}:{String(Math.floor(timestamp % 60)).padStart(2, "0")}s
              </p>
            </div>
            {status === "fixed" && <Check className="w-8 h-8 text-green-500" />}
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5 mb-6">
            {[
              { label: "Clarity", val: `${score}%`, color: getScoreColor(score) },
              { label: "Timestamp", val: `${timestamp.toFixed(2)}s`, color: "text-accent" },
              { label: "Ghost Eng", val: `${ghostEnergy}%`, color: ghostEnergy > 40 ? "text-primary" : "text-green-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-background p-4">
                <p className="font-body text-[8px] tracking-[0.2em] text-muted-foreground uppercase mb-1">{stat.label}</p>
                <p className={cn("font-headline text-2xl tracking-wide", stat.color)}>{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onIsolate} className="bg-white/5 border-white/10 text-[9px] tracking-widest h-9">
              <Play className="w-3 h-3 mr-2" /> ISOLATE
            </Button>
            <Button variant="outline" size="sm" onClick={onApprove} className="bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20 text-[9px] tracking-widest h-9">
              <Check className="w-3 h-3 mr-2" /> APPROVE
            </Button>
            <Button variant="outline" size="sm" onClick={onFlag} className="bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 text-[9px] tracking-widest h-9">
              <Flag className="w-3 h-3 mr-2" /> FLAG
            </Button>
            {(status === "ghost" || status === "warn") && (
              <Button onClick={onFix} className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 text-[9px] tracking-widest h-9">
                <Zap className="w-3 h-3 mr-2" /> TTS FIX
              </Button>
            )}
          </div>

          {ghostReason && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-sm">
              <p className="font-body text-[8px] tracking-widest text-primary uppercase mb-2">Diagnostic Note</p>
              <p className="font-editorial italic text-sm text-muted-foreground leading-relaxed">{ghostReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from "@/lib/utils";
