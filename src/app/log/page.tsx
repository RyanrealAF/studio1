"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export default function SpectralLog() {
  const events = [
    { id: 1, type: "alignment", status: "success", msg: "Forced alignment complete: 'WEED YOU OUT'", time: "10:24:05" },
    { id: 2, type: "scoring", status: "warning", msg: "Low spectral confidence detected at index w_42", time: "10:24:12" },
    { id: 3, type: "repair", status: "success", msg: "TTS Blend applied to token 'DEVOTION'", time: "10:25:40" },
    { id: 4, type: "system", status: "info", msg: "Engine initialized on CUDA device 0", time: "09:00:01" },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8">
        <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">SYSTEM / TELEMETRY</p>
        <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">Spectral <span className="text-primary">Log</span></h1>
      </header>

      <Card className="bg-white/[0.02] border-white/5 rounded-sm">
        <CardHeader className="border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="font-headline text-xl tracking-widest uppercase">Live Telemetry</CardTitle>
          <CardDescription className="text-[9px] uppercase tracking-[0.2em]">Real-time analysis and repair events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5 font-mono text-[11px]">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-6 p-4 hover:bg-white/[0.01] transition-colors group">
                <div className="text-white/20 group-hover:text-primary transition-colors">
                  <Clock className="w-3 h-3" />
                </div>
                <span className="text-muted-foreground w-20">{event.time}</span>
                <span className={cn(
                  "uppercase tracking-widest font-bold px-2 py-0.5 rounded-[2px] text-[9px]",
                  event.status === "success" ? "bg-green-500/10 text-green-500" :
                  event.status === "warning" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                )}>
                  {event.status}
                </span>
                <span className="flex-1 text-foreground/80 uppercase tracking-tight">{event.msg}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from "@/lib/utils";
