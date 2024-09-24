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

// CREATE JOB SCHEMA
export const createReferJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
  company: z.string().trim().min(1, "Company is required").max(100, "Company must not exceed 100 characters"),
  location: z.string().trim().min(1, "Location is required").max(100, "Location must not exceed 100 characters"),
  skills: z.string().trim().min(1, "Skills are required"),
  workType: z.enum(["full-time", "part-time", "contract"]),
  category: z.string().trim().min(1, "Category is required"),
  salary: z.string().trim().min(1, "Salary is required"),
  applyLink: z.string().trim().min(1, "Apply Link is required").url("Invalid URL"),
  jobType: z.enum(["onsite", "remote"]),
});

// SCHEMA VALIDATIONS FOR FORMS
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type CreateReferJobSchemaType = z.infer<typeof createReferJobSchema>;