
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scissors, 
  Activity, 
  History, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Mic2,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

export default function Dashboard() {
  const { user } = useUser();

  const stats = [
    { label: "Total Repairs", value: "1,284", icon: Zap, color: "text-primary" },
    { label: "Avg Clarity", value: "88%", icon: BarChart3, color: "text-accent" },
    { label: "Theater Uptime", value: "99.9%", icon: Activity, color: "text-green-500" },
  ];

  const recentProjects = [
    { id: "1", name: "WEED YOU OUT", date: "2h ago", status: "CLEANED", words: 117 },
    { id: "2", name: "BONE CONTRACT", date: "5h ago", status: "FLAGGED", words: 84 },
    { id: "3", name: "STREETLIGHTS", date: "1d ago", status: "REPAIRING", words: 203 },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary to-transparent opacity-30" />
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">CONSOLE / DASHBOARD</p>
          <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">
            OPERATOR <span className="text-primary">{user?.displayName?.split(' ')[0] || "STATION"}</span>
          </h1>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 tracking-widest text-[10px] h-12 px-8 rounded-sm shadow-xl shadow-primary/10">
          <Link href="/surgery">
            NEW INCISION <ArrowRight className="ml-3 w-4 h-4" />
          </Link>
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/[0.02] border-white/5 rounded-sm overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-[2px] h-full bg-white/5 group-hover:bg-primary transition-colors" />
            <CardHeader className="pb-2">
              <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
              <CardDescription className="text-[9px] uppercase tracking-[0.2em]">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-headline tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Workspace Card */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 rounded-sm h-full flex flex-col">
            <CardHeader className="border-b border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline text-xl tracking-widest uppercase">Theater Queue</CardTitle>
                  <CardDescription className="text-[9px] uppercase tracking-[0.2em]">Active projects awaiting surgical review</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary text-[8px] tracking-widest">3 ACTIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-white/5">
                {recentProjects.map((project) => (
                  <Link 
                    key={project.id} 
                    href="/surgery" 
                    className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-sm bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                        <Mic2 className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div>
                        <h4 className="font-headline text-lg tracking-wide uppercase">{project.name}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{project.words} tokens mapped · {project.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <Badge className={cn(
                        "text-[8px] tracking-widest px-2 py-0.5 rounded-sm",
                        project.status === "CLEANED" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                        project.status === "FLAGGED" ? "bg-primary/10 text-primary border-primary/20" : 
                        "bg-accent/10 text-accent border-accent/20"
                      )}>
                        {project.status}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-white/5 bg-black/20 text-center">
              <Button variant="ghost" className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground">
                VIEW ALL PROJECTS
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions / Diagnostic */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white/[0.02] border-white/5 rounded-sm">
            <CardHeader>
              <CardTitle className="font-headline text-lg tracking-widest uppercase">Quick Entry</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-14 border-white/5 bg-white/[0.01] hover:bg-white/[0.05] group">
                <Scissors className="mr-4 w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Operating Room</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Start new vocal session</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-14 border-white/5 bg-white/[0.01] hover:bg-white/[0.05] group">
                <FileText className="mr-4 w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Ground Truth</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Manage lyric assets</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-14 border-white/5 bg-white/[0.01] hover:bg-white/[0.05] group">
                <History className="mr-4 w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Archives</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider">View session history</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border border-primary/10 rounded-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Zap className="w-4 h-4 fill-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Precision Tip</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic font-editorial">
                "Alignment mode locates timestamps for words it already knows exist. Accuracy jumps dramatically on compressed boom-bap stems."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
