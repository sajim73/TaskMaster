"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Legend } from "recharts";

interface StatusChartProps {
  completed: number;
  pending: number;
  overdue: number;
}

export function StatusChart({ completed, pending, overdue }: StatusChartProps) {
  const chartData = [
    { status: "completed", tasks: completed, fill: "hsl(142, 71%, 45%)" },
    { status: "pending", tasks: pending, fill: "hsl(217, 91%, 60%)" },
    { status: "overdue", tasks: overdue, fill: "hsl(0, 72%, 51%)" },
  ].filter((item) => item.tasks > 0);

  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
    completed: {
      label: "Completed",
      color: "hsl(142, 71%, 45%)",
    },
    pending: {
      label: "Pending",
      color: "hsl(217, 91%, 60%)",
    },
    overdue: {
      label: "Overdue",
      color: "hsl(0, 72%, 51%)",
    },
  };

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
