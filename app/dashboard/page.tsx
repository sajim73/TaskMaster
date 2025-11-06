"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getTaskStats } from "@/lib/api/stats";
import { getCategories } from "@/lib/api/categories";
import { StatCard } from "./_components/stat-card";
import { CategoryChart } from "./_components/category-chart";
import { StatusChart } from "./_components/status-chart";
import { RecentActivity } from "./_components/recent-activity";
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Stats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byCategory: { category: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}

interface RecentTask {
  _id: string;
  title: string;
  status: string;
  category?: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  color?: string;
}

export default function DashboardPage() {
  const { isLoading } = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsResponse, categoriesResponse] = await Promise.all([
        getTaskStats(),
        getCategories(),
      ]);
      
      if (statsResponse.success) {
        setStats(statsResponse.stats);
        setRecentTasks(statsResponse.recentActivity);
      }
      
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your tasks and productivity
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading dashboard...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Stat Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Tasks"
              value={stats?.total || 0}
              icon={ListTodo}
            />
            <StatCard
              title="Completed"
              value={stats?.completed || 0}
              icon={CheckCircle2}
            />
            <StatCard
              title="Pending"
              value={stats?.pending || 0}
              icon={Clock}
            />
            <StatCard
              title="Overdue"
              value={stats?.overdue || 0}
              icon={AlertCircle}
            />
          </div>

          {/* Row 2: Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <CategoryChart data={stats?.byCategory || []} categories={categories} />
            <StatusChart
              completed={stats?.completed || 0}
              pending={stats?.pending || 0}
              overdue={stats?.overdue || 0}
            />
          </div>

          {/* Row 3: Recent Activity */}
          <RecentActivity tasks={recentTasks} />
        </div>
      )}
    </div>
  );
}
