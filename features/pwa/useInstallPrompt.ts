"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

/** Chrome's install event, which TypeScript's DOM types don't include yet. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/**
 * Captures the browser's "this site can be installed" event so our own button
 * can trigger it. Browsers without the event (iOS Safari) get instructions.
 */
export function useInstallPrompt() {
  const t = useTranslations("install");
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => setPrompt(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) {
      toast.info(t("manualHint"));
      return;
    }
    await prompt.prompt();
    setPrompt(null);
  };

  return { canInstall: prompt !== null, install, dismiss: () => setPrompt(null) };
}
