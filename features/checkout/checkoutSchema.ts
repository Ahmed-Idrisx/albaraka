import { z } from "zod";

/** Egyptian mobile numbers: 010, 011, 012 or 015 followed by 8 digits. */
const EGYPT_MOBILE = /^01[0125]\d{8}$/;

/** Built with the current language's messages, so errors show in that language. */
export const createCheckoutSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(2, t("nameRequired")),
    phone: z.string().trim().regex(EGYPT_MOBILE, t("phoneInvalid")),
    // Checked against the area list in the form: only required when areas exist.
    areaId: z.string(),
    address: z.string().trim().min(10, t("addressTooShort")),
    notes: z.string().trim().max(300, t("notesTooLong")).optional(),
  });

export type CheckoutValues = z.infer<ReturnType<typeof createCheckoutSchema>>;
