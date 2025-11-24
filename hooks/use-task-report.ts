"use client";

import { useCallback, useState } from "react";
import { getTasks } from "@/lib/api/tasks";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@/app/tasks/_components/task-columns";

export function useTaskReport() {
  const { toastSuccess, toastError } = useToast();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const fetchReportTasks = useCallback(async (): Promise<Task[] | null> => {
    if (!startDate || !endDate) {
      toastError("Select both start and end dates");
      return null;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toastError("Start date must be before end date");
      return null;
    }

    try {
      const response = await getTasks({
        startDate,
        endDate,
        limit: 1000,
      });

      if (!response.success) {
        toastError(response.error || "Failed to generate report");
        return null;
      }

      if (!response.tasks.length) {
        toastError("No tasks found for the selected range");
        return null;
      }

      return response.tasks;
    } catch (error) {
      console.error("Failed to fetch report tasks:", error);
      toastError("Failed to generate report");
      return null;
    }
  }, [endDate, startDate, toastError]);

  const downloadCsv = useCallback(async () => {
    setDownloadingCsv(true);
    try {
      const reportTasks = await fetchReportTasks();
      if (!reportTasks) return;

      const headers = ["Title", "Description", "Category", "Priority", "Status", "Due Date"];
      const rows: string[][] = reportTasks.map((task) => [
        task.title,
        task.description || "",
        task.category || "",
        task.priority,
        task.status,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row.map((cell: string) => `"${cell.replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `taskmaster-report_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toastSuccess("CSV report downloaded");
    } catch (error) {
      console.error("Failed to download CSV report:", error);
      // toast already handled in helper
    } finally {
      setDownloadingCsv(false);
    }
  }, [endDate, fetchReportTasks, startDate, toastSuccess]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    downloadCsv,
    downloadingCsv,
  };
}

