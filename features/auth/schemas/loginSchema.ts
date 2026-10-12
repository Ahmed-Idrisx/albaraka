import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
