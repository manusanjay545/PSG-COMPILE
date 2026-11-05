"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  BookOpen,
  Trophy,
  BarChart3,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
  Award,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDialog } from "@/components/search-dialog";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";

type NavbarAccount = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  collegeName: string | null;
  currentStreak: number;
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [account, setAccount] = React.useState<NavbarAccount | null>(null);
  const [recentBadges, setRecentBadges] = React.useState<Array<{ id: string; name: string; icon: string; description: string; award: { awarded_at: string } | null }>>([]);

  React.useEffect(() => {
    let active = true;
    const loadAccount = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase.from("profiles")
          .select("full_name, avatar_url, college_name, current_streak")
          .eq("id", user.id).maybeSingle();
        if (active) setAccount({
          id: user.id,
          email: user.email || "",
          fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
          avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          collegeName: profile?.college_name || null,
          currentStreak: profile?.current_streak || 0,
        });
      } catch {
        // Keep the public navigation usable when Supabase is not configured.
      }
    };
    void loadAccount();
    return () => { active = false; };
  }, []);

  React.useEffect(() => {
    if (!account) return;
    let active = true;
    fetch("/api/achievements", { cache: "no-store" }).then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (active && result?.badges) setRecentBadges(result.badges.filter((badge: { earned: boolean }) => badge.earned).slice(0, 3));
      }).catch(() => undefined);
    return () => { active = false; };
  }, [account]);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Clear the local account view even if the auth service is temporarily unreachable.
    } finally {
      setAccount(null);
      router.replace("/login");
      router.refresh();
    }
  };

  const navLinks = [
    { label: "Compiler", href: "/compiler", icon: Code2 },
    { label: "Problems", href: "/problems", icon: Code2 },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Contests", href: "/contests", icon: Trophy },
    { label: "Scoreboard", href: "/leaderboard", icon: BarChart3 },
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size={36} showText={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === "/compiler"
                  ? pathname === "/" || pathname.startsWith("/compiler")
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-zinc-800/80 text-indigo-400 border border-zinc-700/60"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-3 bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 w-56 justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs">Search problems, users...</span>
              </div>
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                Ctrl K
              </kbd>
            </Button>

            {/* Streak Pill */}
            {account && account.currentStreak > 0 && <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{account.currentStreak}d Streak</span>
            </div>}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 text-zinc-400 hover:text-zinc-100"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Notifications Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-zinc-400 hover:text-zinc-100"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel className="flex items-center justify-between font-normal text-xs text-zinc-400">
                  <span>Notifications</span>
                  <span className="text-[10px] text-zinc-500">{recentBadges.length} earned</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {recentBadges.length ? recentBadges.map((badge) => <DropdownMenuItem key={badge.id} className="flex flex-col items-start gap-1 py-2 focus:bg-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200"><Award className="h-3.5 w-3.5 text-emerald-400" /><span>{badge.icon} {badge.name}</span></div>
                  <p className="text-[11px] text-zinc-400">{badge.description}{badge.award ? ` · ${new Date(badge.award.awarded_at).toLocaleDateString()}` : ""}</p>
                </DropdownMenuItem>) : <div className="px-2 py-3 text-xs text-zinc-500">No badges earned yet. Solve problems to earn them.</div>}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-zinc-900 border border-zinc-800/80"
                >
                  <Avatar className="h-7 w-7 border border-indigo-500/40">
                    <AvatarImage src={account?.avatarUrl || ""} />
                    <AvatarFallback className="bg-indigo-600 text-[11px] font-bold text-white">
                      {account?.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-zinc-200 leading-none">
                      {account?.fullName || "Account"}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      {account?.collegeName || account?.email || "Sign in to your account"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-zinc-100">{account?.fullName || "Welcome"}</p>
                    <p className="text-xs text-zinc-400">{account?.email || "Sign in to save your progress"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={account ? `/profile/${account.id}` : "/login"} className="cursor-pointer">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer text-indigo-400 focus:text-indigo-300">
                    Admin Portal
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {account ? <DropdownMenuItem onSelect={(event) => { event.preventDefault(); void signOut(); }} className="cursor-pointer text-red-400 focus:text-red-300">Sign out</DropdownMenuItem> : <DropdownMenuItem asChild><Link href="/login" className="cursor-pointer">Sign in</Link></DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-zinc-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full justify-center gap-2 border-zinc-800"
              >
                <Search className="h-4 w-4" />
                Search PSGCompile
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}


