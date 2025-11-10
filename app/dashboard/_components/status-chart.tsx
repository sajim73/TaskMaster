"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Legend } from "recharts";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/types/shared";

interface StatusChartProps {
  completed: number;
  pending: number;
  overdue: number;
}

const STATUS_FILL_COLORS: Record<TaskStatus, string> = {
  completed: "hsl(142, 71%, 45%)",
  pending: "hsl(217, 91%, 60%)",
  overdue: "hsl(0, 72%, 51%)",
};

export function StatusChart({ completed, pending, overdue }: StatusChartProps) {
  const counts: Record<TaskStatus, number> = {
    completed,
    pending,
    overdue,
  };

  const chartData = TASK_STATUSES.map((status) => ({
    status,
    tasks: counts[status],
    fill: STATUS_FILL_COLORS[status],
  })).filter((item) => item.tasks > 0);

  const chartConfig: Record<string, { label: string; color?: string }> = {
    tasks: { label: "Tasks" },
  };

  TASK_STATUSES.forEach((status) => {
    chartConfig[status] = {
      label: TASK_STATUS_LABELS[status],
      color: STATUS_FILL_COLORS[status],
    };
  });

  const total = completed + pending + overdue;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="tasks"
                nameKey="status"
                stroke="0"
                isAnimationActive={false}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
