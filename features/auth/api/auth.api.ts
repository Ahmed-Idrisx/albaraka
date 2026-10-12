import type { AuthUser } from "@/features/auth/types/auth";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";
import { apiClient } from "@/lib/apiClient";

export const authApi = {
  login: async (
    values: LoginFormValues,
  ): Promise<{ user: AuthUser; token: string }> => {
    const { data } = await apiClient.post<{ user: AuthUser; token: string }>(
      "/auth/login",
      values,
    );
    console.log("login response data:", data);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>("/auth/me");
    return data;
  },
};
