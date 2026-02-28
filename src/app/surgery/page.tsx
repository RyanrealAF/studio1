
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic2, Play, Activity, Scissors, Save, Download, Sparkles, AlertCircle } from "lucide-react";
import { forcedAlignment, type ForcedAlignmentOutput } from "@/ai/flows/forced-alignment-flow";
import { scoreSpectralConfidence, type SpectralConfidenceScoringOutput } from "@/ai/flows/spectral-confidence-scoring";
import { contextualEqProfileGeneration, type ContextualEqProfileGenerationOutput } from "@/ai/flows/contextual-eq-profile-generation";
import { useToast } from "@/hooks/use-toast";

export default function SurgeryRoom() {
  const { toast } = useToast();
  const [lyrics, setLyrics] = useState("");
  const [productionContext, setProductionContext] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");

  const [alignmentData, setAlignmentData] = useState<ForcedAlignmentOutput | null>(null);
  const [confidenceData, setConfidenceData] = useState<SpectralConfidenceScoringOutput | null>(null);
  const [eqProfile, setEqProfile] = useState<ContextualEqProfileGenerationOutput | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAudioUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startSurgery = async () => {
    if (!lyrics || !audioUri) {
      toast({ title: "Missing Data", description: "Please provide both lyrics and a vocal audio file.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setActiveTab("analysis");

    try {
      // 1. Forced Alignment
      const alignment = await forcedAlignment({ lyrics, audioDataUri: audioUri });
      setAlignmentData(alignment);

      // 2. Spectral Confidence Scoring
      const confidence = await scoreSpectralConfidence({ 
        lyrics, 
        audioDataUri: audioUri, 
        wordTimestamps: alignment.alignedWords 
      });
      setConfidenceData(confidence);

      // 3. EQ Profile Generation (Optional if context provided)
      if (productionContext) {
        const eq = await contextualEqProfileGeneration({ productionContext });
        setEqProfile(eq);
      }

      toast({ title: "Analysis Complete", description: "Surgery targets identified successfully." });
    } catch (error) {
      console.error(error);
      toast({ title: "Surgery Failed", description: "An error occurred during audio analysis.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 lg:p-16 min-h-screen bg-background max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Scissors className="w-5 h-5" />
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold">OPERATING THEATER 01</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline tracking-tight">THE SURGERY <span className="text-primary">ROOM</span></h1>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 tracking-widest text-[10px] h-12 px-6">
            <Save className="w-4 h-4 mr-2" /> SAVE PROJECT
          </Button>
          <Button className="bg-primary hover:bg-primary/90 tracking-widest text-[10px] h-12 px-8">
            <Download className="w-4 h-4 mr-2" /> EXPORT FINAL
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 w-full lg:w-auto h-auto">
          <TabsTrigger value="setup" className="data-[state=active]:bg-primary h-12 px-8 text-[10px] tracking-widest uppercase">01 SETUP</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary h-12 px-8 text-[10px] tracking-widest uppercase">02 ANALYSIS</TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:bg-primary h-12 px-8 text-[10px] tracking-widest uppercase">03 PROCESSING</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">THE WORDS</CardTitle>
                  <CardDescription className="text-muted-foreground font-body text-xs">Input the exact lyrics for forced alignment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Paste your lyrics here..."
                    className="min-h-[300px] bg-black/40 border-white/10 font-body text-sm leading-relaxed"
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">PRODUCTION CONTEXT</CardTitle>
                  <CardDescription className="text-muted-foreground font-body text-xs">Describe the sonic goal (e.g. 'Punchy modern pop').</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input 
                    placeholder="E.g. Grimy boom-bap, high presence, aggressive compression"
                    className="bg-black/40 border-white/10"
                    value={productionContext}
                    onChange={(e) => setProductionContext(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/[0.02] border-white/5 h-full">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">THE AUDIO</CardTitle>
                  <CardDescription className="text-muted-foreground font-body text-xs">Upload the raw dry vocal track.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer relative group">
                    <Input 
                      type="file" 
                      accept="audio/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mic2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="font-headline text-xl">DROP VOCAL STEM</p>
                        <p className="text-xs text-muted-foreground">WAV, FLAC, or MP3 (Max 50MB)</p>
                      </div>
                    </div>
                  </div>

                  {audioUri && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Play className="w-6 h-6 text-primary" />
                        <div>
                          <p className="text-xs font-bold text-foreground">VOCAL_INPUT_RAW.WAV</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Ready for incision</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">LOCKED</Badge>
                    </div>
                  )}

                  <div className="pt-8">
                    <Button 
                      onClick={startSurgery} 
                      disabled={isProcessing || !lyrics || !audioUri}
                      className="w-full h-16 font-headline text-2xl bg-primary hover:bg-primary/90 tracking-widest disabled:opacity-30"
                    >
                      {isProcessing ? (
                        <>ANALYZING FREQUENCIES <Sparkles className="ml-4 w-6 h-6 animate-pulse" /></>
                      ) : (
                        <>START SURGERY <Activity className="ml-4 w-6 h-6" /></>
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
            <Card className="lg:col-span-2 bg-white/[0.02] border-white/5">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-headline text-2xl">SPECTRAL CONFIDENCE</CardTitle>
                    <CardDescription className="text-muted-foreground font-body text-xs">Identified repair targets across the timeline.</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">REALTIME</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {confidenceData ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {confidenceData.wordConfidenceScores.map((score, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "group relative p-3 border rounded-sm transition-all",
                            score.needsRepair 
                              ? "bg-primary/10 border-primary/40" 
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-sm font-bold",
                              score.needsRepair ? "text-primary" : "text-foreground"
                            )}>
                              {score.word}
                            </span>
                            <div className="flex items-center gap-2">
                              <Progress value={score.confidenceScore} className="h-1 w-12" />
                              <span className="text-[9px] text-muted-foreground">{Math.round(score.confidenceScore)}%</span>
                            </div>
                          </div>
                          {score.needsRepair && (
                            <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full">
                              <AlertCircle className="w-2 h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Activity className="w-12 h-12 opacity-20 animate-pulse" />
                    <p className="text-[10px] tracking-widest uppercase">Waiting for incision data...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">SURGERY TARGETS</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">Words flagged for repair.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {confidenceData?.wordConfidenceScores.filter(w => w.needsRepair).length ? (
                    confidenceData.wordConfidenceScores.filter(w => w.needsRepair).map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-white/5">
                        <div>
                          <p className="text-sm font-bold">{w.word}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{w.startTime}s - {w.endTime}s</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 text-[9px] font-bold">REPAIR</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-8">No critical targets found.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">ALIGNMENT STATS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Total Words</span>
                    <span className="text-foreground">{alignmentData?.alignedWords.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Sync Quality</span>
                    <span className="text-green-500">OPTIMAL</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Latency</span>
                    <span className="text-foreground">12ms</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-8 animate-fade-in-up">
           <Card className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">RECOMMENDED EQ PROFILE</CardTitle>
                <CardDescription className="text-muted-foreground font-body text-xs">Contextual processing based on "{productionContext || 'Generic'}"</CardDescription>
              </CardHeader>
              <CardContent>
                {eqProfile ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] tracking-widest uppercase font-bold text-accent">EQ BANDS</h4>
                        {eqProfile.recommendedEqProfile.map((band, i) => (
                          <div key={i} className="p-4 border border-white/10 bg-black/20 rounded-sm flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-primary uppercase">{band.type}</p>
                              <p className="text-lg font-headline">{band.frequency} Hz</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">GAIN</p>
                              <p className="text-lg font-headline text-accent">{band.gain > 0 ? '+' : ''}{band.gain} dB</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                       {eqProfile.compressorSettings && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] tracking-widest uppercase font-bold text-accent">DYNAMICS</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-white/10 bg-black/20 rounded-sm">
                              <p className="text-[10px] text-muted-foreground uppercase">Threshold</p>
                              <p className="text-xl font-headline">{eqProfile.compressorSettings.threshold} dB</p>
                            </div>
                            <div className="p-4 border border-white/10 bg-black/20 rounded-sm">
                              <p className="text-[10px] text-muted-foreground uppercase">Ratio</p>
                              <p className="text-xl font-headline">{eqProfile.compressorSettings.ratio}</p>
                            </div>
                          </div>
                        </div>
                       )}

                       {eqProfile.otherProcessingNotes && (
                        <div className="p-6 bg-accent/5 border border-accent/20 rounded-sm">
                           <h4 className="text-[10px] tracking-widest uppercase font-bold text-accent mb-4">ENGINEER NOTES</h4>
                           <p className="text-sm text-muted-foreground leading-relaxed italic">{eqProfile.otherProcessingNotes}</p>
                        </div>
                       )}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <AlertCircle className="w-12 h-12 opacity-20" />
                    <p className="text-[10px] tracking-widest uppercase">No profile generated. Ensure production context is set.</p>
                  </div>
                )}
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
