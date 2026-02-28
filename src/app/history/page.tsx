"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectHistory() {
  const projects = [
    { id: "1", name: "WEED YOU OUT", date: "2024-05-20", clarity: "92%", status: "CLEANED", words: 117 },
    { id: "2", name: "BONE CONTRACT", date: "2024-05-19", clarity: "78%", status: "FLAGGED", words: 84 },
    { id: "3", name: "STREETLIGHTS", date: "2024-05-18", clarity: "85%", status: "REPAIRING", words: 203 },
    { id: "4", name: "DEVOTION", date: "2024-05-15", clarity: "91%", status: "CLEANED", words: 156 },
    { id: "5", name: "FILTERED", date: "2024-05-12", clarity: "88%", status: "CLEANED", words: 92 },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-fade-in-up">
      <header className="border-b border-white/5 pb-8">
        <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-muted-foreground/50">VAULT / ARCHIVES</p>
        <h1 className="text-4xl lg:text-5xl font-headline tracking-tighter uppercase">Project <span className="text-primary">History</span></h1>
      </header>

      <Card className="bg-white/[0.02] border-white/5 rounded-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.01]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground h-14">Project Name</TableHead>
              <TableHead className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground h-14">Date</TableHead>
              <TableHead className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground h-14">Clarity</TableHead>
              <TableHead className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground h-14">Status</TableHead>
              <TableHead className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground h-14 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] group">
                <TableCell className="font-headline text-lg tracking-wide uppercase">{p.name}</TableCell>
                <TableCell className="text-[10px] font-mono text-muted-foreground uppercase">{p.date}</TableCell>
                <TableCell className="font-headline text-accent text-lg">{p.clarity}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[8px] tracking-widest rounded-sm border-white/10 uppercase">
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-accent transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
