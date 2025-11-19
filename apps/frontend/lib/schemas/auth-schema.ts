import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

export const newPasswordFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "Token is required"),
});

export const resetPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
