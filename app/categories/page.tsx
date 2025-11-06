"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CategoryDialog } from "./_components/category-dialog";
import { PredefinedCategoriesDialog } from "./_components/predefined-categories-dialog";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getCategoryIcon } from "@/lib/category-icons";
import { useRequireAuth } from "@/hooks/use-require-auth";

interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useRequireAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [predefinedDialogOpen, setPredefinedDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory(data: any) {
    try {
      const response = await createCategory(data);
      if (response.success) {
        toast({ title: "Success", description: "Category created successfully" });
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateCategory(data: any) {
    if (!editingCategory) return;

    try {
      const response = await updateCategory(editingCategory._id, data);
      if (response.success) {
        toast({ title: "Success", description: "Category updated successfully" });
        fetchCategories();
        setEditingCategory(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete);
      if (response.success) {
        toast({ title: "Success", description: "Category deleted successfully" });
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks with custom categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPredefinedDialogOpen(true)}>
            Add Predefined
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {loading ? (
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
        initialData={editingCategory || undefined}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
              You cannot delete a category that has tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

