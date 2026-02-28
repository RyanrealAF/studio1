"use client";

import { useRef, useEffect } from "react";

interface WaveformCanvasProps {
  buffer: AudioBuffer | null;
  playPct: number;
  onSeek: (pct: number) => void;
}

export function WaveformCanvas({ buffer, playPct, onSeek }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!buffer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < width; i++) {
      let min = 1, max = -1;
      for (let j = 0; j < step; j++) {
        const d = data[i * step + j] || 0;
        if (d < min) min = d;
        if (d > max) max = d;
      }
      const energy = Math.abs(max - min);
      // Aesthetic coloring: Redder for high energy, subtle gold tint
      const r = Math.floor(160 * energy + 40);
      const g = Math.floor(20 * energy);
      ctx.fillStyle = `rgba(${r},${g},${g},0.75)`;
      const amp = height / 2;
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  }, [buffer]);

  return (
    <div
      className="relative overflow-hidden rounded-sm cursor-crosshair bg-black/40 border border-white/5 h-[72px]"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek((e.clientX - rect.left) / rect.width);
      }}
    >
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={72} 
        className="w-full h-full block"
      />
      {playPct > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none bg-primary shadow-[0_0_6px_rgba(174,27,20,0.5)] transition-all duration-75"
          style={{ left: `${playPct * 100}%` }}
        />
      )}
      <div className="absolute top-1.5 right-3 font-body text-[8px] tracking-[0.3em] text-white/10 uppercase select-none pointer-events-none">
        STEM WAVEFORM
      </div>
    </div>
  );
}
