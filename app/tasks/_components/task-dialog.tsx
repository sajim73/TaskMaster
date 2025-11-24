"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import { formatDateString, parseDateString } from "@/lib/date-utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { ClientCategory } from "@/lib/types/client";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "@/lib/types/shared";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(TASK_PRIORITIES),
  status: z.enum(TASK_STATUSES),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

interface DueDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parsedDate = value ? parseDateString(value) : null;
  const date = parsedDate ?? undefined;
  const displayValue = date ? displayDateFormatter.format(date) : "";
  const startMonth = new Date(2000, 0, 1);
  const endMonth = new Date(new Date().getFullYear() + 50, 11, 1);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full justify-start text-left font-normal",
          !displayValue && "text-muted-foreground"
        )}
      >
        {displayValue || "Select a due date"}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
      {open ? (
        <div className="absolute right-0 bottom-full z-50 mb-2 overflow-hidden rounded-md border border-border bg-popover p-0 shadow-md">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              if (selected) {
                onChange(formatDateString(selected));
              } else {
                onChange("");
              }
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            showOutsideDays={false}
          />
        </div>
      ) : null}
    </div>
  );
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormValues) => Promise<void>;
  initialData?: Partial<TaskFormValues>;
  categories: ClientCategory[];
  title?: string;
  description?: string;
  defaultDueDate?: Date;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  categories,
  title = "Add Task",
  description = "Create a new task to organize your work",
  defaultDueDate,
}: TaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      priority: initialData?.priority || "medium",
      status: initialData?.status || "pending",
      dueDate: initialData?.dueDate || (defaultDueDate ? formatDateString(defaultDueDate) : ""),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category: initialData?.category || "",
        priority: initialData?.priority || "medium",
        status: initialData?.status || "pending",
        dueDate: initialData?.dueDate || (defaultDueDate ? formatDateString(defaultDueDate) : ""),
      });
    }
  }, [open, initialData, defaultDueDate, form]);

  async function handleSubmit(data: TaskFormValues) {
    await onSubmit(data);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task description"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          categories.map((category) => {
                            const Icon = getCategoryIcon(category.icon || "folder");
                            return (
                              <SelectItem key={category._id} value={category.name}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-5 h-5 rounded flex items-center justify-center"
                                    style={{
                                      backgroundColor: category.color || "#6366f1",
                                    }}
                                  >
                                    <Icon className="h-3 w-3 text-white" />
                                  </div>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {TASK_PRIORITY_LABELS[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {TASK_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DueDatePicker
                        value={field.value || ""}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

