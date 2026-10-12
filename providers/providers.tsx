"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider } from "next-themes";
import { createQueryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DirectionProvider dir="rtl">{children}</DirectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
