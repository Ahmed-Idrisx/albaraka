"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider } from "next-themes";
import { createQueryClient } from "@/shared/lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session; created in state so it survives re-renders
  // but is never shared between requests on the server.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        `class` because globals.css keys the dark palette off `.dark`, and the shop
        follows the device by default — someone browsing at night gets a dark shop
        without having found a switch first.

        disableTransitionOnChange stops every transition on the page from animating
        at once when the theme flips, which reads as a stutter rather than a fade.
      */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* Tells Radix popovers, selects and menus which way to open. */}
        <DirectionProvider dir="rtl">{children}</DirectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
