"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";

export function HeroCta() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return (
      <>
        <Button size="lg" className="text-lg px-8" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8" asChild>
          <Link href="/tasks">View Tasks</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button size="lg" className="text-lg px-8" asChild>
        <Link href="/register">Get Started</Link>
      </Button>
      <Button size="lg" variant="outline" className="text-lg px-8" asChild>
        <Link href="/login">Login</Link>
      </Button>
    </>
  );
}


