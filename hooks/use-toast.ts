import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";

type ToastTone = "default" | "destructive";

function notify({
  tone = "default",
      title,
      description,
    }: {
  tone?: ToastTone;
      title?: string;
      description?: string;
}) {
  if (tone === "destructive") {
    sonnerToast.error(title || "Error", { description });
    return;
  }

  sonnerToast.success(title || "Success", { description });
}

export function useToast() {
  const success = useCallback(
    (description: string, title = "Success") => {
      notify({ tone: "default", title, description });
    },
    []
  );

  const error = useCallback(
    (description: string, title = "Error") => {
      notify({ tone: "destructive", title, description });
    },
    []
  );

  const info = useCallback(
    (description: string, title = "Notice") => {
      notify({ tone: "default", title, description });
    },
    []
  );

  return {
    toastSuccess: success,
    toastError: error,
    toastInfo: info,
  };
}

