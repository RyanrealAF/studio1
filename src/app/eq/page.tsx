"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Waves, Save, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EQPanel } from "@/components/vocal-surgeon/EQPanel";

export default function EQMaster() {
  const [eq, setEq] = useState({ sub: -3, mud: -4, presence: 3, air: 1 });

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">AUDIO / MASTERING</p>
          <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">EQ <span className="text-accent">Master</span></h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 tracking-widest text-[9px] h-10 px-5 text-muted-foreground rounded-sm">
            <RefreshCcw className="w-3 h-3 mr-2" /> RESET DEFAULTS
          </Button>
          <Button className="bg-primary hover:bg-primary/90 tracking-widest text-[9px] h-10 px-6 rounded-sm">
            <Save className="w-3 h-3 mr-2" /> SAVE GLOBAL PROFILE
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <EQPanel value={eq} onChange={setEq} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 rounded-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg tracking-widest uppercase">Target Context</CardTitle>
              <CardDescription className="text-[9px] uppercase tracking-[0.2em]">Current production constraints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 prose prose-invert max-w-none">
              <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                "Grimy boom-bap, distorted bass, tight snare cracks. Grit target: NOT pristine."
              </p>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                The master profile ensures all surgical repairs maintain the same spectral signature across multiple stems in a project.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
