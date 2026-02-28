
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Scissors, 
  Activity, 
  Settings2, 
  FileText, 
  LayoutDashboard, 
  History, 
  LogOut, 
  LogIn, 
  Waves,
  Database
} from "lucide-react";
import { useUser, useAuth, initiateGoogleSignIn, initiateSignOut } from "@/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { group: "Analysis", items: [
    { label: "Console", href: "/", icon: LayoutDashboard, num: "01" },
    { label: "Spectral Log", href: "/log", icon: Activity, num: "02" },
  ]},
  { group: "Operating Theater", items: [
    { label: "Surgery Room", href: "/surgery", icon: Scissors, num: "03" },
    { label: "Identity Sync", href: "/identity", icon: FileText, num: "04" },
    { label: "EQ Master", href: "/eq", icon: Waves, num: "05" },
  ]},
  { group: "Vault", items: [
    { label: "Project History", href: "/history", icon: History, num: "06" },
    { label: "Acoustic Assets", href: "/assets", icon: Database, num: "07" },
    { label: "Station Settings", href: "/settings", icon: Settings2, num: "08" },
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
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary to-transparent opacity-50" />
        <h1 className="font-headline text-2xl tracking-[0.12em] text-foreground">
          VOCAL <span className="text-primary">SURGEON</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/60 font-bold">
            ENGINE ONLINE
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-8">
        {navItems.map((group) => (
          <div key={group.group} className="space-y-2">
            <h3 className="px-8 text-[9px] tracking-[0.4em] uppercase text-white/10 font-bold">
              {group.group}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-8 py-3 text-[10px] tracking-[0.2em] uppercase transition-all border-l-2",
                      active 
                        ? "text-primary border-primary bg-primary/5 font-bold" 
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-white/10 hover:bg-white/5"
                    )}
                  >
                    <span className="font-headline text-sm opacity-20 w-5 shrink-0">{item.num}</span>
                    <item.icon className={cn("w-3.5 h-3.5", active ? "text-primary" : "text-muted-foreground")} />
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
              <Avatar className="w-8 h-8 border border-primary/40 p-0.5">
                <AvatarImage src={user.photoURL || undefined} className="rounded-full" />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-headline">
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-foreground truncate">{user.displayName?.toUpperCase()}</p>
                <p className="text-[8px] text-muted-foreground/50 uppercase tracking-widest font-bold">OPERATOR ACTIVE</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 px-2 text-[9px] tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 h-8"
            >
              <LogOut className="w-3 h-3" /> SIGN OUT
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogin}
            className="w-full justify-center gap-3 border-primary/20 bg-primary/5 text-[9px] tracking-widest text-primary hover:bg-primary/10 h-10 rounded-sm font-bold"
          >
            <LogIn className="w-3 h-3" /> OPERATOR LOGIN
          </Button>
        )}
      </div>
    </aside>
  );
}
