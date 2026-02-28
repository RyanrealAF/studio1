
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Scissors, Mic2, Activity, Settings2, FileText, LayoutDashboard, History, LogIn, LogOut } from "lucide-react";
import { useUser, useAuth, initiateGoogleSignIn, initiateSignOut } from "@/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { group: "The Case", items: [
    { label: "Founding Insight", href: "/", icon: LayoutDashboard, num: "01" },
    { label: "System Overview", href: "/#overview", icon: Activity, num: "02" },
  ]},
  { group: "The Engine", items: [
    { label: "Surgery Room", href: "/surgery", icon: Scissors, num: "03" },
    { label: "Word Identity", href: "/identity", icon: FileText, num: "04" },
  ]},
  { group: "The Library", items: [
    { label: "Project History", href: "/history", icon: History, num: "05" },
    { label: "Global Settings", href: "/settings", icon: Settings2, num: "06" },
  ]}
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogin = () => {
    initiateGoogleSignIn(auth);
  };

  const handleLogout = () => {
    initiateSignOut(auth);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background/95 backdrop-blur-md border-r border-white/5 z-50 hidden lg:flex flex-col">
      <div className="p-8 border-b border-white/5 relative overflow-hidden group">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary to-transparent" />
        <h1 className="font-headline text-2xl tracking-[0.12em] text-foreground">
          VOCAL <span className="text-primary">SURGEON</span>
        </h1>
        <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mt-1">
          Build Manifesto · v1.0
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-8">
        {navItems.map((group) => (
          <div key={group.group} className="space-y-2">
            <h3 className="px-8 text-[10px] tracking-[0.4em] uppercase text-white/20 font-bold">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-all border-l-2",
                      active 
                        ? "text-primary border-primary bg-primary/5" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-primary/50 hover:bg-white/5"
                    )}
                  >
                    <span className="font-headline text-lg opacity-40 w-6 shrink-0">{item.num}</span>
                    <item.icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        {isUserLoading ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/5" />
            <div className="h-2 w-20 bg-white/5 rounded" />
          </div>
        ) : user ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-primary/40">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-foreground truncate">{user.displayName?.toUpperCase()}</p>
                <p className="text-[9px] text-muted-foreground uppercase">OPERATOR</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-2 text-[10px] tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              <LogOut className="w-3 h-3" /> LOG OUT
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogin}
            className="w-full justify-center gap-3 border-primary/20 bg-primary/5 text-[10px] tracking-widest text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3 h-3" /> OPERATOR LOGIN
          </Button>
        )}
      </div>
    </aside>
  );
}
