"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Pencil, RefreshCcw } from "lucide-react";
import { EditProfileDialog } from "./_components/edit-profile-dialog";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { resetDemoData } from "@/lib/api/test";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageShell } from "@/components/page-shell";

export default function SettingsPage() {
  const { isLoading } = useRequireAuth();
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const { toastSuccess, toastError } = useToast();
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetDemo = async () => {
    try {
      setResetting(true);
      setConfirmDialogOpen(false);
      const response = await resetDemoData();
      if (response.success) {
        toastSuccess(
          `Created ${response.stats.tasksCreated} tasks and ${response.stats.categoriesCreated} categories`,
          "Demo data loaded"
        );
        // Redirect to tasks page to see the demo data
        router.push("/tasks");
      } else {
        toastError(response.error || "Failed to reset demo data");
      }
    } catch (error) {
      toastError("Failed to reset demo data");
    } finally {
      setResetting(false);
    }
  };

  if (isLoading) return null;

  return (
    <PageShell
      title="Settings"
      description="Manage your account and application preferences"
    >
      <div className="space-y-8 max-w-2xl">
        {/* Appearance */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <label className="text-sm font-medium block mb-2">Theme</label>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => {
              if (value) setTheme(value);
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="light" aria-label="Light theme" className="gap-2">
              <Sun className="h-4 w-4" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Dark theme" className="gap-2">
              <Moon className="h-4 w-4" />
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="System theme" className="gap-2">
              <Monitor className="h-4 w-4" />
              System
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Account */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Account</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <label className="text-sm font-medium text-muted-foreground block">Name</label>
          <p className="mb-4">{user?.name}</p>
          <label className="text-sm font-medium text-muted-foreground block">Email</label>
          <p>{user?.email}</p>
        </div>

        {/* Demo Data */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Demo Data</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Load sample tasks and categories to explore TaskMaster. This will delete all your existing data.
          </p>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 border-destructive/50"
            onClick={() => setConfirmDialogOpen(true)}
            disabled={resetting}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${resetting ? "animate-spin" : ""}`} />
            {resetting ? "Loading..." : "Load Demo Data"}
          </Button>
        </div>
      </div>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentName={user?.name || ""}
        currentEmail={user?.email || ""}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Load demo data?"
        description="This will permanently delete all your existing tasks and categories, and replace them with demo data. This action cannot be undone."
        confirmLabel="Load Demo Data"
        onConfirm={handleResetDemo}
      />
    </PageShell>
  );
}

