"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts";

interface CategoryData {
  category: string;
  count: number;
}

interface Category {
  _id: string;
  name: string;
  color?: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  categories: Category[];
}

export function CategoryChart({ data, categories }: CategoryChartProps) {
const chartConfig = {
  count: {
    label: "Tasks",
    },
    label: {
      color: "hsl(var(--background))",
  },
  };

  // Map category names to colors
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "#6366f1";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
              dataKey="category"
                type="category"
              tickLine={false}
                tickMargin={10}
              axisLine={false}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <Bar dataKey="count" layout="vertical" radius={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
                <LabelList
                  dataKey="category"
                  position="insideLeft"
                  offset={8}
                  className="fill-background"
                  fontSize={12}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
