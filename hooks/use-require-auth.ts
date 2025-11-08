import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const isReady = useMemo(
    () => hasHydrated && isAuthenticated,
    [hasHydrated, isAuthenticated]
  );

  return {
    isAuthenticated,
    hasHydrated,
    isReady,
    isLoading: !hasHydrated,
  };
}

