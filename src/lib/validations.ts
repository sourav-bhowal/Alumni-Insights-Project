import { z } from "zod";

// SIGN-UP SCHEMA
export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, _ , - and numbers ",
    ),
});

// SIGN-IN SCHEMA
export const signInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
});

// SCHEMA VALIDATIONS FOR FORMS
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;