"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";
import type { TaskRecentActivityItem } from "@/lib/types/api";

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface RecentActivityProps {
  tasks: TaskRecentActivityItem[];
}

export function RecentActivity({ tasks }: RecentActivityProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recently updated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recently updated tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="font-medium leading-tight">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-0.5">
                  {task.category && <span>{task.category}</span>}
                  {task.category && <span>•</span>}
                  <span>{timeAgo(new Date(task.updatedAt))}</span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={
                  STATUS_COLORS[task.status] || "bg-gray-500/10"
                }
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

