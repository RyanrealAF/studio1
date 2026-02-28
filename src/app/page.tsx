
import { Hero } from "@/components/vocal-surgeon/Hero";
import { ManifestoSection, ManifestoQuote, Callout } from "@/components/vocal-surgeon/ManifestoSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scissors, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="pb-32">
      <Hero />
      
      <div className="px-8 lg:px-16 max-w-6xl">
        <ManifestoSection 
          id="s1" 
          num="01" 
          eyebrow="The Case" 
          title={<>The Founding<br /><span className="text-primary">Insight</span></>}
        >
          <p>
            Every other vocal repair tool begins with a question: <em>What did they say?</em> Vocal Surgeon begins with an answer. The words are already written. The lyrics exist before the audio is ever loaded. That is not a minor convenience — it is a different epistemology.
          </p>
          <p>
            Most tools run in transcription mode. They listen to a distorted, compressed, AI-generated boom-bap stem and they guess. They guess at slang. They guess at rapid delivery. They guess at glottal stops and ghosted consonant clusters.
          </p>
          
          <ManifestoQuote cite="Core design principle">
            Forced alignment is not a smarter guess. It is the refusal to guess at all. We know devotion lives somewhere in this audio. The only question is exactly where — and how clearly.
          </ManifestoQuote>

          <p>
            The second conviction: <strong>production context is a processing parameter, not metadata.</strong> "Grimy boom-bap, distorted bass, tight snare cracks" does not go in a label field. It defines the EQ target.
          </p>

          <Callout label="The Core Shift" type="green">
            <strong>Transcription:</strong> guess &rarr; threshold &rarr; flag &rarr; pray.<br />
            <strong>Forced alignment:</strong> known words &rarr; locate timestamps &rarr; score spectral confidence at known positions &rarr; precise repair targets.
          </Callout>
        </ManifestoSection>

        <ManifestoSection 
          id="overview" 
          num="02" 
          eyebrow="The Engine" 
          title={<>Clinical<br /><span className="text-accent">Precision</span></>}
        >
          <p>
            Our architecture is built for the high-pressure environment of professional production. We leverage forced alignment to create a sub-millisecond mapping between your intention and the performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
              <h4 className="font-headline text-xl text-foreground mb-3">Alignment Loop</h4>
              <p className="text-sm text-muted-foreground">Uses WhisperX models to synchronize text with acoustic events, generating word-level metadata.</p>
            </div>
            <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
              <h4 className="font-headline text-xl text-foreground mb-3">Confidence Scoring</h4>
              <p className="text-sm text-muted-foreground">Multimodal analysis of spectral density to identify words requiring surgical intervention.</p>
            </div>
          </div>

          <div className="pt-16 text-center">
            <Button asChild size="lg" className="h-16 px-12 font-headline text-2xl tracking-widest bg-primary hover:bg-primary/90">
              <Link href="/surgery">
                ENTER SURGERY ROOM <ArrowRight className="ml-4 w-6 h-6" />
              </Link>
            </Button>
          </div>
        </ManifestoSection>
      </div>

      <footer className="px-8 lg:px-16 pt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] tracking-widest uppercase text-muted-foreground/30">
          <p>© 2024 VOCAL SURGEON INSTRUMENTS</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Legal</Link>
            <Link href="#" className="hover:text-primary transition-colors">Manifesto</Link>
          </div>
          <p>BUILT WHILE <span className="text-primary">BLEEDING</span></p>
        </div>
      </footer>
    </div>
  );
}
