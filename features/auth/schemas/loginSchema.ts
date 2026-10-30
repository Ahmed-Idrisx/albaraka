import { z } from "zod";

/** Built with the current language's messages, so errors show in that language. */
export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMin")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
