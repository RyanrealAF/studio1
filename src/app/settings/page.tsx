"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2, Shield, Zap, Cpu, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StationSettings() {
  const settingsGroups = [
    { title: "Processing Engine", icon: Cpu, items: [
      { label: "Hardware Acceleration (CUDA/MPS)", desc: "Utilize GPU for spectral alignment mapping", default: true },
      { label: "High Precision Analysis", desc: "Increase FFT size for word clarity scoring", default: true },
    ]},
    { title: "Security & Auth", icon: Shield, items: [
      { label: "Biometric Incision Lock", desc: "Require confirmation before destructive repairs", default: false },
      { label: "Anonymous Telemetry", desc: "Share anonymized spectral data for engine training", default: true },
    ]},
    { title: "Notifications", icon: Bell, items: [
      { label: "Incision Complete Alerts", desc: "Notify when background analysis finishes", default: true },
      { label: "Station Status Updates", desc: "Report on engine uptime and maintenance", default: false },
    ]}
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">SYSTEM / CONFIG</p>
          <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">Station <span className="text-primary">Settings</span></h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90 tracking-widest text-[9px] h-10 px-8 rounded-sm">
          SAVE ALL CHANGES
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingsGroups.map((group) => (
          <Card key={group.title} className="bg-white/[0.02] border-white/5 rounded-sm">
            <CardHeader className="border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <group.icon className="w-4 h-4 text-primary" />
                <CardTitle className="font-headline text-lg tracking-widest uppercase">{group.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-6">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest">{item.label}</Label>
                    <p className="text-[9px] text-muted-foreground uppercase leading-relaxed tracking-wider">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
