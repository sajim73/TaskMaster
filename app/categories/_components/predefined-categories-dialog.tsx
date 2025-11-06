"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { predefinedCategories } from "@/lib/category-icons";
import { getCategoryIcon } from "@/lib/category-icons";
import { Check } from "lucide-react";

interface PredefinedCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (data: { name: string; color: string; icon: string; description: string }) => Promise<void>;
  existingCategories: string[];
}

export function PredefinedCategoriesDialog({
  open,
  onOpenChange,
  onAddCategory,
  existingCategories,
}: PredefinedCategoriesDialogProps) {
  async function handleAddCategory(category: { name: string; color: string; icon: string; description: string }) {
    await onAddCategory(category);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Predefined Categories</DialogTitle>
          <DialogDescription>
            Quickly add commonly used categories to get started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {predefinedCategories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            const alreadyExists = existingCategories.includes(category.name.toLowerCase());

            return (
              <div
                key={category.name}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                {alreadyExists ? (
                  <Button variant="ghost" size="sm" disabled className="flex-shrink-0">
                    <Check className="h-4 w-4 mr-2" />
                    Added
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCategory(category)}
                    className="flex-shrink-0"
                  >
                    Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

