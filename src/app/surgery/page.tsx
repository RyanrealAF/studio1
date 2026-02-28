
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic2, Play, Activity, Scissors, Save, Download, Sparkles, Pause, History, FileAudio } from "lucide-react";
import { WaveformCanvas } from "@/components/vocal-surgeon/WaveformCanvas";
import { WordChip, WordStatus } from "@/components/vocal-surgeon/WordChip";
import { WordInspector } from "@/components/vocal-surgeon/WordInspector";
import { EQPanel } from "@/components/vocal-surgeon/EQPanel";
import { forcedAlignment } from "@/ai/flows/forced-alignment-flow";
import { scoreSpectralConfidence } from "@/ai/flows/spectral-confidence-scoring";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

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
  const { user } = useUser();
  const db = useFirestore();

  const [projectTitle, setProjectTitle] = useState("NEW VOCAL STEM");
  const [lyrics, setLyrics] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");
  const [playPct, setPlayPct] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordScores, setWordScores] = useState<Record<string, WordData>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [eqSettings, setEqSettings] = useState({ sub: -3, mud: -4, presence: 3, air: 1 });

  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startedAtRef = useRef(0);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buf = await ctx.decodeAudioData(await file.arrayBuffer());
        setAudioCtx(ctx);
        setAudioBuffer(buf);
        toast({ title: "Stem Loaded", description: `${file.name} initialized for frequency mapping.` });
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const startSurgery = async () => {
    if (!lyrics || !audioFile) {
      toast({ 
        title: "Setup Incomplete", 
        description: "Both lyrics and audio stem are required for analysis.", 
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    setActiveTab("analysis");

    try {
      const audioUri = await fileToBase64(audioFile);
      
      toast({ title: "Synchronizing", description: "Running forced alignment via Gemini..." });
      const alignment = await forcedAlignment({ 
        lyrics, 
        audioDataUri: audioUri
      });
      
      toast({ title: "Scanning Spectra", description: "Calculating clarity scores per token..." });
      const confidence = await scoreSpectralConfidence({ 
        lyrics, 
        audioDataUri: audioUri, 
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

      // Persist project if user is logged in
      if (user && db) {
        const projectRef = doc(collection(db, "users", user.uid, "projects"));
        const projectData = {
          id: projectRef.id,
          userId: user.uid,
          name: projectTitle,
          productionContext: "User-defined",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        setDocumentNonBlocking(projectRef, projectData, { merge: true });
      }

      toast({ title: "Mapping Complete", description: `${alignment.alignedWords.length} tokens synchronized.` });
    } catch (error) {
      console.error(error);
      toast({ title: "Incision Failed", description: "The engine encountered an error during spectral mapping.", variant: "destructive" });
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
    <div className="p-8 lg:p-12 min-h-screen bg-background max-w-screen-2xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative overflow-hidden group">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <div className="space-y-2 relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-3 text-primary">
            <Scissors className="w-4 h-4" />
            <span className="text-[9px] tracking-[0.5em] uppercase font-bold text-primary">OPERATING THEATER 01</span>
          </div>
          <Input 
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value.toUpperCase())}
            className="bg-transparent border-none p-0 h-auto text-4xl lg:text-6xl font-headline tracking-tighter uppercase leading-none focus-visible:ring-0 text-foreground selection:bg-primary/30"
          />
        </div>
        
        <div className="flex gap-3 relative z-10">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 tracking-widest text-[9px] h-10 px-5 text-muted-foreground hover:text-foreground rounded-sm">
            <History className="w-3 h-3 mr-2" /> REVISION HISTORY
          </Button>
          <Button className="bg-primary hover:bg-primary/90 tracking-widest text-[9px] h-10 px-6 rounded-sm shadow-lg shadow-primary/10">
            <Download className="w-3 h-3 mr-2" /> EXPORT STEM
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full lg:w-auto h-auto rounded-sm">
          <TabsTrigger value="setup" className="data-[state=active]:bg-primary data-[state=active]:text-white h-10 px-8 text-[9px] tracking-widest uppercase rounded-sm transition-all">01 SETUP</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white h-10 px-8 text-[9px] tracking-widest uppercase rounded-sm transition-all">02 ANALYSIS</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-10 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-white/[0.02] border-white/5 rounded-sm overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/[0.01]">
                  <CardTitle className="font-headline text-xl tracking-widest uppercase">Ground Truth Lyrics</CardTitle>
                  <CardDescription className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Input words for forced-alignment mapping</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea 
                    placeholder="PASTE FULL LYRICS HERE..."
                    className="min-h-[450px] bg-transparent border-none font-body text-sm leading-loose p-8 focus-visible:ring-0 placeholder:text-white/5 selection:bg-primary/30 uppercase"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-10">
              <Card className="bg-white/[0.02] border-white/5 rounded-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-xl tracking-widest uppercase">Acoustic Input</CardTitle>
                  <CardDescription className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Dry vocal stem source</CardDescription>
                </CardHeader>
                <CardContent className="space-y-10">
                  <div className="border-2 border-dashed border-white/5 rounded-sm p-12 text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer relative group bg-black/20 overflow-hidden">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      onChange={handleFileUpload}
                    />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all border border-white/5",
                        audioFile ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-muted-foreground group-hover:text-primary"
                      )}>
                        {audioFile ? <FileAudio className="w-8 h-8" /> : <Mic2 className="w-8 h-8" />}
                      </div>
                      <div>
                        <p className="font-headline text-xl tracking-widest">
                          {audioFile ? audioFile.name.toUpperCase() : "UPLOAD VOCAL STEM"}
                        </p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] mt-1">24-bit / 48kHz preferred</p>
                      </div>
                    </div>
                  </div>

                  <EQPanel value={eqSettings} onChange={setEqSettings} />

                  <Button 
                    onClick={startSurgery} 
                    disabled={isProcessing || !lyrics || !audioFile}
                    className="w-full h-20 font-headline text-3xl bg-primary hover:bg-primary/90 tracking-widest disabled:opacity-20 rounded-sm shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <>ANALYZING SPECTRA <Sparkles className="ml-4 w-8 h-8 animate-pulse" /></>
                    ) : (
                      <>BEGIN INCISION <Activity className="ml-4 w-8 h-8" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-10 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <Card className="bg-white/[0.02] border-white/5 rounded-sm">
                <CardHeader className="pb-4 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <button 
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20"
                      >
                        {isPlaying ? <Pause className="text-white fill-white w-4 h-4" /> : <Play className="text-white fill-white ml-0.5 w-4 h-4" />}
                      </button>
                      <div>
                        <CardTitle className="font-headline text-xl tracking-widest uppercase">Word Clarity Map</CardTitle>
                        <p className="text-[8px] font-body text-muted-foreground tracking-[0.3em] uppercase">Spectral confidence distribution</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-body text-[8px] tracking-widest px-2 uppercase">Analysis Active</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-10">
                  <WaveformCanvas buffer={audioBuffer} playPct={playPct} onSeek={handleSeek} />
                  
                  <div className="flex flex-wrap gap-2.5 min-h-[400px] content-start bg-black/10 p-6 rounded-sm border border-white/5 relative">
                    <div className="absolute top-2 left-3 font-body text-[7px] tracking-[0.4em] text-white/5 uppercase">Mapped Tokens</div>
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
                      <div className="w-full flex flex-col items-center justify-center py-32 text-muted-foreground/10">
                        <Scissors className="w-16 h-16 mb-6 animate-pulse" />
                        <p className="font-headline text-2xl tracking-widest uppercase">Awaiting alignment data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <WordInspector 
                wordData={selectedWord}
                onApprove={() => updateWord(selectedId!, { status: "clean", score: Math.max(selectedWord!.score, 82) })}
                onFlag={() => updateWord(selectedId!, { status: "ghost" })}
                onFix={() => updateWord(selectedId!, { status: "fixed", score: 85 + Math.floor(Math.random() * 10) })}
                onIsolate={() => {
                  if (selectedWord) {
                    playAudio(Math.max(0, selectedWord.timestamp - 0.1));
                  }
                }}
              />

              <Card className="bg-white/[0.02] border-white/5 rounded-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-lg tracking-widest uppercase">Operating Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { label: "Total Word Tokens", val: Object.values(wordScores).length, color: "text-foreground" },
                    { label: "Avg Clarity Score", val: Object.values(wordScores).length ? `${Math.round(Object.values(wordScores).reduce((a, b) => a + b.score, 0) / Object.values(wordScores).length)}%` : "0%", color: "text-accent" },
                    { label: "Incision Points", val: Object.values(wordScores).filter(w => w.status === "ghost").length, color: "text-primary" },
                    { label: "Repair Status", val: isProcessing ? "IN PROGRESS" : "READY", color: isProcessing ? "text-accent" : "text-green-500" },
                  ].map((log) => (
                    <div key={log.label} className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground border-b border-white/5 pb-2.5">
                      <span>{log.label}</span>
                      <span className={log.color}>{log.val}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
