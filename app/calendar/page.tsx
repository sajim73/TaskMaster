"use client";

  import { useState, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getTasks, createTask, updateTask } from "@/lib/api/tasks";
import { Plus } from "lucide-react";
import { TaskDialog } from "../tasks/_components/task-dialog";
import { getCategories } from "@/lib/api/categories";
import { useToast } from "@/hooks/use-toast";
import { parseDateString, isSameDate, formatDateString, getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date-utils";
import { STATUS_COLORS, PRIORITY_COLORS } from "@/lib/constants";

interface Task {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "overdue";
  dueDate?: string | null;
}

interface Category {
  _id: string;
  name: string;
  color?: string;
  icon?: string;
}

export default function CalendarPage() {
  const { isLoading } = useRequireAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [monthJustChanged, setMonthJustChanged] = useState(false);

  // Fetch tasks when displayed month changes
  useEffect(() => {
    fetchData();
  }, [displayedMonth]);

  // Filter tasks for selected date whenever allTasks or selectedDate changes
  useEffect(() => {
    const filtered = allTasks.filter((task) => {
      if (!task.dueDate) return false;
        if (!task.dueDate) return false;
        const taskDate = parseDateString(task.dueDate);
        if (!taskDate) return false;
        return isSameDate(taskDate, selectedDate);
    });
    setTasks(filtered);
  }, [selectedDate, allTasks]);

  async function fetchData() {
    try {
      setLoading(true);

      // Get first and last day of the currently displayed month
      const monthStart = getFirstDayOfMonth(displayedMonth);
      const monthEnd = getLastDayOfMonth(displayedMonth);

      const [tasksResponse, categoriesResponse] = await Promise.all([
        getTasks({
          startDate: formatDateString(monthStart),
          endDate: formatDateString(monthEnd),
        }),
        getCategories(),
      ]);

      if (tasksResponse.success) {
        setAllTasks(tasksResponse.tasks);
        
        // After loading tasks, run smart date selection if month was changed via dropdown
        if (monthJustChanged) {
          selectSmartDate(displayedMonth, tasksResponse.tasks);
          setMonthJustChanged(false);
        }
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

  function selectSmartDate(month: Date, tasksData: Task[]) {
    const today = new Date();
    const firstDay = getFirstDayOfMonth(month);

    // 1. If current day is within the month, select it
    if (today.getMonth() === month.getMonth() && 
        today.getFullYear() === month.getFullYear()) {
      setSelectedDate(today);
      return;
    }

    // 2. Otherwise, find first day with tasks in this month
    const tasksInMonth = tasksData.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === month.getMonth() &&
             taskDate.getFullYear() === month.getFullYear();
    });

    if (tasksInMonth.length > 0) {
      // Sort by date and select the first one
      tasksInMonth.sort((a, b) => 
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      );
      setSelectedDate(new Date(tasksInMonth[0].dueDate!));
      return;
    }

    // 3. If no tasks, select first day of month
    setSelectedDate(firstDay);
  }

  // Get task count for a specific date
  const getTaskCountForDate = (date: Date): number => {
           return allTasks.filter((task) => {
             if (!task.dueDate) return false;
             const taskDate = parseDateString(task.dueDate);
             if (!taskDate) return false;
             return isSameDate(taskDate, date);
           }).length;
  };

  const statusBorderColors = {
    completed: "border-green-500",
    pending: "border-blue-500",
    overdue: "border-red-500",
  };

  async function handleCreateTask(data: any) {
    const response = await createTask(data);
    if (response.success) {
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
      });
      fetchData();
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to create task",
        variant: "destructive",
      });
    }
  }

  async function handleStatusChange(taskId: string, newStatus: string) {
    const response = await updateTask(taskId, { 
      status: newStatus as "pending" | "completed" | "overdue"
    });
    if (response.success) {
      toast({
        title: "Status updated",
        description: "Task status has been updated",
      });
      fetchData();
    } else {
      toast({
        title: "Error",
        description: response.error || "Failed to update status",
        variant: "destructive",
      });
    }
  }

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-2">View and manage tasks by date</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Calendar */}
        <Card className="md:w-auto">
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  // Only update displayedMonth if we're switching to a different month
                  if (date.getMonth() !== displayedMonth.getMonth() || 
                      date.getFullYear() !== displayedMonth.getFullYear()) {
                    setDisplayedMonth(date);
                  }
                }
              }}
              month={displayedMonth}
              onMonthChange={(newMonth) => {
                setDisplayedMonth(newMonth);
                setMonthJustChanged(true);
              }}
              captionLayout="dropdown"
              showOutsideDays={false}
              className="rounded-md border [--cell-size:--spacing(13)] md:[--cell-size:--spacing(14)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("default", { month: "long" });
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const taskCount = getTaskCountForDate(day.date);
                  const isSelected = modifiers.selected;
                  return (
                    <CalendarDayButton 
                      day={day} 
                      modifiers={modifiers} 
                      {...props}
                      className={isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""}
                    >
                      {children}
                      <span className={`text-xs h-4 font-medium ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}>
                        {taskCount > 0 ? `${taskCount} ${taskCount === 1 ? "task" : "tasks"}` : " "}
                      </span>
                    </CalendarDayButton>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </CardTitle>
                {!loading && tasks.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No tasks for this date
              </div>
            ) : (
              <div className="space-y-4 pr-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`border-l-4 pl-4 py-2 ${
                      statusBorderColors[task.status as keyof typeof statusBorderColors] ||
                      "border-gray-500"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-tight">{task.title}</p>
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task._id, value)}
                        >
                          <SelectTrigger
                            className={`h-7 w-[120px] border-0 ${
                              STATUS_COLORS[task.status as keyof typeof STATUS_COLORS] ||
                              "bg-gray-500/10"
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="completed">completed</SelectItem>
                            <SelectItem value="overdue">overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {task.category && <span>{task.category}</span>}
                        {task.category && <span>•</span>}
                        <span className="capitalize">{task.priority} priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        categories={categories}
        defaultDueDate={selectedDate}
        title="Add Task"
        description="Create a task for the selected date"
      />
    </div>
  );
}

