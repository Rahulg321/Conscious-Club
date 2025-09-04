import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

export const newPasswordFormSchema = z.object({
  password: z.string().min(6),
  token: z.string(),
});

export const resetPasswordFormSchema = z.object({
  email: z.string().email(),
});
