"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";
import { getErrorMessage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryClient";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

const startSession = (token: string) =>
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

const endSession = () => fetch("/api/session", { method: "DELETE" });

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: async ({ user, token }) => {
      queryClient.setQueryData(queryKeys.me, user);
      await startSession(token);
      router.replace("/dashboard");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await endSession();
      queryClient.clear();
      router.replace("/login");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
