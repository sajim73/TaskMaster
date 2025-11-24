"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getTaskStats } from "@/lib/api/stats";
import { StatCard } from "./_components/stat-card";
import { CategoryChart } from "./_components/category-chart";
import { StatusChart } from "./_components/status-chart";
import { RecentActivity } from "./_components/recent-activity";
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useCategories } from "@/lib/store/categories";
import { PageShell } from "@/components/page-shell";
import type { TaskStatsSummary, TaskRecentActivityItem } from "@/lib/types/api";
import {
  TASK_STATUS_LABELS,
  TASK_STATUSES,
} from "@/lib/types/shared";

export default function DashboardPage() {
  const { isReady, isLoading } = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const { categories, loadCategories } = useCategories();
  const [stats, setStats] = useState<TaskStatsSummary | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskRecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await getTaskStats();
      
      if (statsResponse.success) {
        setStats(statsResponse.stats);
        setRecentTasks(statsResponse.recentActivity);
      } else {
        setStats(null);
        setRecentTasks([]);
        console.error("Failed to fetch stats:", statsResponse.error);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    fetchData();
  }, [isReady, fetchData]);

  useEffect(() => {
    if (!isReady) return;
    loadCategories();
  }, [isReady, loadCategories]);

  if (isLoading) return null;

  return (
    <PageShell
      title={`Welcome back, ${user?.name || "User"}!`}
      description="Here's an overview of your tasks and productivity"
    >
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading dashboard...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Tasks" value={stats?.total || 0} icon={ListTodo} />
            <StatCard
              title={TASK_STATUS_LABELS.completed}
              value={stats?.completed || 0}
              icon={CheckCircle2}
            />
            <StatCard
              title={TASK_STATUS_LABELS.pending}
              value={stats?.pending || 0}
              icon={Clock}
            />
            <StatCard
              title={TASK_STATUS_LABELS.overdue}
              value={stats?.overdue || 0}
              icon={AlertCircle}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CategoryChart data={stats?.byCategory || []} categories={categories} />
            <StatusChart
              completed={stats?.completed || 0}
              pending={stats?.pending || 0}
              overdue={stats?.overdue || 0}
            />
          </div>

          <RecentActivity tasks={recentTasks} />
        </div>
      )}
    </PageShell>
  );
}
