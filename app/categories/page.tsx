"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryDialog, CategoryFormValues } from "./_components/category-dialog";
import { PredefinedCategoriesDialog } from "./_components/predefined-categories-dialog";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryData,
} from "@/lib/api/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getCategoryIcon } from "@/lib/category-icons";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useCategories, useCategoryStatus } from "@/lib/store/categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageShell } from "@/components/page-shell";
import type { ClientCategory } from "@/lib/types/client";

export default function CategoriesPage() {
  const { toastSuccess, toastError } = useToast();
  const { isReady, isLoading } = useRequireAuth();
  const { categories, loadCategories } = useCategories();
  const status = useCategoryStatus();
  const isLoadingCategories = status === "loading";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [predefinedDialogOpen, setPredefinedDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ClientCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    loadCategories({ force: true });
  }, [isReady, loadCategories]);

  async function handleCreateCategory(data: CategoryFormValues) {
    try {
      const payload: CategoryData = { ...data };
      const response = await createCategory(payload);
      if (response.success) {
        toastSuccess("Category created successfully");
        await loadCategories({ force: true });
      } else {
        toastError(response.error || "Failed to create category");
      }
    } catch (error) {
      toastError("Failed to create category");
    }
  }

  async function handleUpdateCategory(data: CategoryFormValues) {
    if (!editingCategory) return;

    try {
      const payload: CategoryData = { ...data };
      const response = await updateCategory(editingCategory._id, payload);
      if (response.success) {
        toastSuccess("Category updated successfully");
        await loadCategories({ force: true });
        setEditingCategory(null);
      } else {
        toastError(response.error || "Failed to update category");
      }
    } catch (error) {
      toastError("Failed to update category");
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete);
      if (response.success) {
        toastSuccess("Category deleted successfully");
        await loadCategories({ force: true });
      } else {
        toastError(response.error || "Failed to delete category");
      }
    } catch (error) {
      toastError("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }

  if (isLoading) return null;

  return (
    <PageShell
      title="Categories"
      description="Organize your tasks with custom categories"
      headerActions={
        <>
          <Button variant="outline" onClick={() => setPredefinedDialogOpen(true)}>
            Add Predefined
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </>
      }
    >
      {isLoadingCategories ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>No categories yet. Create your first category or add predefined ones!</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Icon</TableHead>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.icon || "folder");
                  return (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: category.color || "#6366f1" }}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="max-w-[400px] truncate" title={category.description || ""}>
                          {category.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCategoryToDelete(category._id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {categories.length} row(s) total.
          </div>
        </>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCategory(null);
        }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        initialData={
          editingCategory
            ? {
                name: editingCategory.name,
                description: editingCategory.description,
                color: editingCategory.color,
                icon: editingCategory.icon,
              }
            : undefined
        }
        title={editingCategory ? "Edit Category" : "New Category"}
        description={
          editingCategory
            ? "Update your category details"
            : "Create a new category to organize your tasks"
        }
      />

      <PredefinedCategoriesDialog
        open={predefinedDialogOpen}
        onOpenChange={setPredefinedDialogOpen}
        onAddCategory={handleCreateCategory}
        existingCategories={categories.map((c) => c.name.toLowerCase())}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete category?"
        description="This action cannot be undone. This will permanently delete the category. You cannot delete a category that has tasks."
        confirmLabel="Delete"
        tone="destructive"
        onConfirm={handleDeleteCategory}
      />
    </PageShell>
  );
}

