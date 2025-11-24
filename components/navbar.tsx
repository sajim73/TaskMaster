"use client";

import { useState } from "react";
import { CheckCircle2, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { logout } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4 relative">
        {/* Mobile Menu - Only show when authenticated */}
        {isAuthenticated && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  TaskMaster
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/tasks">Tasks</Link>
                </Button>
                <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/calendar">Calendar</Link>
                </Button>
                <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/categories">Categories</Link>
                </Button>
                <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/settings">Settings</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">TaskMaster</span>
        </Link>

        {/* Desktop Navigation Links - Only show when authenticated */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/calendar">Calendar</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categories">Categories</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
          </div>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

