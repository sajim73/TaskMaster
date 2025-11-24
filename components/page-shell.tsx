"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function PageShell({
  title,
  description,
  headerActions,
  children,
  className,
  headerClassName,
}: PageShellProps) {
  return (
    <div className={cn("container mx-auto px-4 py-8 space-y-8", className)}>
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          headerClassName
        )}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {headerActions}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

