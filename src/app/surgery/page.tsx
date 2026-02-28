"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic2, Play, Activity, Scissors, Save, Download, Sparkles, AlertCircle, Pause } from "lucide-react";
import { WaveformCanvas } from "@/components/vocal-surgeon/WaveformCanvas";
import { WordChip, WordStatus } from "@/components/vocal-surgeon/WordChip";
import { WordInspector } from "@/components/vocal-surgeon/WordInspector";
import { forcedAlignment } from "@/ai/flows/forced-alignment-flow";
import { scoreSpectralConfidence } from "@/ai/flows/spectral-confidence-scoring";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WordData {
  id: string;
  word: string;
  score: number;
  status: WordStatus;
  timestamp: number;
  sectionName?: string;
  ghostReason?: string | null;
}

export default function SurgeryRoom() {
  const { toast } = useToast();
  const [lyrics, setLyrics] = useState("");
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");
  const [playPct, setPlayPct] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordScores, setWordScores] = useState<Record<string, WordData>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startedAtRef = useRef(0);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buf = await ctx.decodeAudioData(await file.arrayBuffer());
        setAudioCtx(ctx);
        setAudioBuffer(buf);
        toast({ title: "Stem Loaded", description: "Audio buffer initialized for frequency mapping." });
      } catch (err) {
        console.error(err);
        toast({ title: "Loading Failed", description: "Could not decode audio data.", variant: "destructive" });
      }
    }
  };

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {}
    }
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const playAudio = useCallback((from = 0) => {
    if (!audioBuffer || !audioCtx) return;
    stopAudio();
    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(audioCtx.destination);
    src.start(0, from);
    sourceRef.current = src;
    startedAtRef.current = audioCtx.currentTime;
    offsetRef.current = from;
    setIsPlaying(true);

    const tick = () => {
      if (!audioCtx || !audioBuffer) return;
      const el = audioCtx.currentTime - startedAtRef.current + offsetRef.current;
      const pct = Math.min(el / audioBuffer.duration, 1);
      setPlayPct(pct);
      if (el < audioBuffer.duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        setPlayPct(0);
        offsetRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [audioBuffer, audioCtx, stopAudio]);

  const togglePlay = () => isPlaying ? stopAudio() : playAudio(offsetRef.current);

  const handleSeek = (pct: number) => {
    if (!audioBuffer) return;
    const from = pct * audioBuffer.duration;
    offsetRef.current = from;
    setPlayPct(pct);
    if (isPlaying) playAudio(from);
  };

  const startSurgery = async () => {
    if (!lyrics || !audioBuffer) {
      toast({ title: "Missing Data", description: "Lyrics and audio stem required for alignment.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setActiveTab("analysis");

    try {
      // For the prototype, we use a placeholder URI since forcedAlignment expects one
      // In a real app, we'd handle large blobs via Storage
      const alignment = await forcedAlignment({ lyrics, audioDataUri: "data:audio/wav;base64,..." });
      
      const confidence = await scoreSpectralConfidence({ 
        lyrics, 
        audioDataUri: "data:audio/wav;base64,...", 
        wordTimestamps: alignment.alignedWords 
      });

      const scores: Record<string, WordData> = {};
      confidence.wordConfidenceScores.forEach((w, i) => {
        const id = `w_${i}`;
        scores[id] = {
          id,
          word: w.word,
          score: w.confidenceScore,
          status: w.needsRepair ? "ghost" : w.confidenceScore < 75 ? "warn" : "clean",
          timestamp: w.startTime,
        };
      });

      setWordScores(scores);
      toast({ title: "Mapping Complete", description: `${alignment.alignedWords.length} tokens synchronized.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Incision Failed", description: "Alignment engine encountered spectral noise.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateWord = (id: string, patch: Partial<WordData>) => {
    setWordScores(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch }
    }));
  };

  const selectedWord = selectedId ? wordScores[selectedId] : null;

  return (
    <div className="p-8 lg:p-16 min-h-screen bg-background max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Scissors className="w-5 h-5" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-primary">OPERATING THEATER 01</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline tracking-tight">THE SURGERY <span className="text-primary">ROOM</span></h1>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 tracking-widest text-[10px] h-12 px-6 text-muted-foreground hover:text-foreground">
            <Save className="w-4 h-4 mr-2" /> SAVE PROJECT
          </Button>
          <Button className="bg-primary hover:bg-primary/90 tracking-widest text-[10px] h-12 px-8 shadow-[0_0_20px_rgba(174,27,20,0.2)]">
            <Download className="w-4 h-4 mr-2" /> EXPORT FINAL
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full lg:w-auto h-auto rounded-sm">
          <TabsTrigger value="setup" className="data-[state=active]:bg-primary data-[state=active]:text-white h-12 px-8 text-[10px] tracking-widest uppercase rounded-sm">01 SETUP</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white h-12 px-8 text-[10px] tracking-widest uppercase rounded-sm">02 ANALYSIS</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-widest">THE WORDS</CardTitle>
                <CardDescription className="text-muted-foreground font-body text-xs uppercase tracking-wider">Input ground truth lyrics for forced alignment</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Paste your lyrics here..."
                  className="min-h-[400px] bg-black/40 border-white/10 font-body text-sm leading-relaxed focus:border-primary/50"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl tracking-widest">THE STEM</CardTitle>
                  <CardDescription className="text-muted-foreground font-body text-xs uppercase tracking-wider">Upload dry vocal track</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="border-2 border-dashed border-white/10 rounded-sm p-16 text-center space-y-4 hover:border-primary/50 transition-all cursor-pointer relative group bg-black/20">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                        audioBuffer ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <Mic2 className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="font-headline text-2xl tracking-widest">
                          {audioBuffer ? "FILE LOADED" : "DROP VOCAL STEM"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">WAV, AIFF, or FLAC (Max 50MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button 
                      onClick={startSurgery} 
                      disabled={isProcessing || !lyrics || !audioBuffer}
                      className="w-full h-20 font-headline text-3xl bg-primary hover:bg-primary/90 tracking-widest disabled:opacity-30 shadow-lg shadow-primary/10"
                    >
                      {isProcessing ? (
                        <>ANALYZING SPECTRA <Sparkles className="ml-4 w-8 h-8 animate-pulse" /></>
                      ) : (
                        <>START SURGERY <Activity className="ml-4 w-8 h-8" /></>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/[0.02] border-white/5 rounded-sm">
                <CardHeader className="pb-4 border-b border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause className="text-white fill-white" /> : <Play className="text-white fill-white ml-1" />}
                      </button>
                      <div>
                        <CardTitle className="font-headline text-2xl tracking-widest uppercase">Frequency Map</CardTitle>
                        <p className="text-[9px] font-body text-muted-foreground tracking-widest uppercase">Real-time spectral analysis</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 font-body text-[9px] tracking-widest">LIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <WaveformCanvas buffer={audioBuffer} playPct={playPct} onSeek={handleSeek} />
                  
                  <div className="flex flex-wrap gap-2 min-h-[300px] content-start">
                    {Object.values(wordScores).length > 0 ? (
                      Object.values(wordScores).map((w) => (
                        <WordChip 
                          key={w.id}
                          id={w.id}
                          word={w.word}
                          score={w.score}
                          status={w.status}
                          selected={selectedId === w.id}
                          onSelect={setSelectedId}
                        />
                      ))
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                        <Scissors className="w-12 h-12 mb-4 animate-pulse" />
                        <p className="font-headline text-xl tracking-widest">AWAITING INCISION DATA</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <WordInspector 
                wordData={selectedWord}
                onApprove={() => updateWord(selectedId!, { status: "clean", score: Math.max(selectedWord!.score, 82) })}
                onFlag={() => updateWord(selectedId!, { status: "ghost" })}
                onFix={() => updateWord(selectedId!, { status: "fixed", score: 85 + Math.floor(Math.random() * 10) })}
                onIsolate={() => playAudio(selectedWord!.timestamp - 0.1)}
              />

              <Card className="bg-white/[0.02] border-white/5 rounded-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl tracking-widest">SURGERY LOG</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-white/5 pb-2">
                    <span>Total Tokens</span>
                    <span className="text-foreground">{Object.values(wordScores).length}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-white/5 pb-2">
                    <span>Sync Quality</span>
                    <span className="text-green-500">OPTIMAL</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Repair Flags</span>
                    <span className="text-primary">{Object.values(wordScores).filter(w => w.status === "ghost").length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
