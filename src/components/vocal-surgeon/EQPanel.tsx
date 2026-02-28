
"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EQSettings {
  sub: number;
  mud: number;
  presence: number;
  air: number;
}

interface EQPanelProps {
  value: EQSettings;
  onChange: (settings: EQSettings) => void;
}

export function EQPanel({ value, onChange }: EQPanelProps) {
  const bands = [
    { id: "sub", label: "Sub", range: "20–80 Hz" },
    { id: "mud", label: "Mud", range: "200–400 Hz" },
    { id: "presence", label: "Presence", range: "2–5 kHz" },
    { id: "air", label: "Air", range: "8–16 kHz" },
  ] as const;

  const updateBand = (id: keyof EQSettings, newVal: number[]) => {
    onChange({ ...value, [id]: newVal[0] });
  };

  return (
    <Card className="bg-white/[0.02] border-white/5 rounded-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-xl tracking-widest uppercase">EQ Profile</CardTitle>
          <Badge variant="outline" className="text-[8px] tracking-widest border-primary/30 text-primary">BOOM-BAP</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {bands.map((band) => (
            <div key={band.id} className="bg-black/20 border border-white/5 p-4 rounded-sm space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="font-body text-[8px] tracking-[0.2em] text-muted-foreground uppercase">{band.label}</p>
                  <p className="font-body text-[7px] text-white/20 uppercase">{band.range}</p>
                </div>
                <span className="font-headline text-lg text-accent tracking-tighter">
                  {value[band.id] >= 0 ? "+" : ""}{value[band.id]}dB
                </span>
              </div>
              <Slider 
                value={[value[band.id]]} 
                min={-12} 
                max={12} 
                step={0.5} 
                onValueChange={(val) => updateBand(band.id, val)}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="h-16 relative bg-black/40 border border-white/5 rounded-sm overflow-hidden">
          <svg className="w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path 
              d="M 0 20 Q 25 15, 50 20 T 100 20" 
              fill="none" 
              stroke="hsl(var(--accent))" 
              strokeWidth="0.5" 
              className="animate-pulse"
            />
            <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeOpacity="0.05" strokeWidth="0.2" strokeDasharray="1,1" />
          </svg>
          <div className="absolute top-1.5 right-3 font-body text-[7px] tracking-[0.3em] text-white/10 uppercase select-none pointer-events-none">
            CURVE PREVIEW
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
