"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, FileAudio, Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcousticAssets() {
  const assets = [
    { name: "STEM_VOCAL_LEAD_01.WAV", size: "42.5 MB", duration: "3:42", date: "2h ago" },
    { name: "STEM_VOCAL_BACKING_01.WAV", size: "38.1 MB", duration: "3:42", date: "2h ago" },
    { name: "STEM_VOCAL_ADLIB_01.WAV", size: "12.4 MB", duration: "1:15", date: "2h ago" },
    { name: "RAW_UNPROCESSED_V2.FLAC", size: "88.9 MB", duration: "4:05", date: "1d ago" },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8">
        <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">VAULT / STORAGE</p>
        <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">Acoustic <span className="text-accent">Assets</span></h1>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {assets.map((asset) => (
          <Card key={asset.name} className="bg-white/[0.02] border-white/5 rounded-sm hover:border-accent/30 transition-all group">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-sm bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-accent/30 transition-colors">
                  <FileAudio className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                </div>
                <div>
                  <h4 className="font-headline text-lg tracking-wide uppercase">{asset.name}</h4>
                  <div className="flex gap-4 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>{asset.size}</span>
                    <span>{asset.duration}</span>
                    <span>UPLOADED {asset.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[9px] tracking-widest h-9 px-4">
                  <Play className="w-3 h-3 mr-2 fill-current" /> AUDITION
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
