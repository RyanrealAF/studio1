"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function IdentitySync() {
  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">DATA / GROUND TRUTH</p>
          <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">Identity <span className="text-accent">Sync</span></h1>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground tracking-widest text-[9px] h-10 px-6 rounded-sm">
          <Plus className="w-3 h-3 mr-2" /> NEW LYRIC ASSET
        </Button>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="SEARCH TRUTH RECORDS..." className="bg-white/5 border-white/10 pl-10 rounded-sm text-[10px] tracking-widest h-12 uppercase" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["WEED YOU OUT", "BONE CONTRACT", "STREETLIGHTS", "DEVOTION", "FILTERED"].map((name) => (
          <Card key={name} className="bg-white/[0.02] border-white/5 rounded-sm group hover:border-accent/30 transition-all cursor-pointer">
            <CardHeader className="pb-2">
              <FileText className="w-5 h-5 text-accent mb-2" />
              <CardTitle className="font-headline text-lg tracking-wide uppercase">{name}</CardTitle>
              <CardDescription className="text-[8px] uppercase tracking-widest">Ground Truth · v1.4</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[1px] w-full bg-white/5 my-4" />
              <div className="flex justify-between items-center text-[9px] text-muted-foreground font-bold tracking-widest">
                <span>117 TOKENS</span>
                <span>SYNCED 2D AGO</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
