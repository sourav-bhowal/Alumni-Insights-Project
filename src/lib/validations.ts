import { title } from "process";
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
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(100, "Company must not exceed 100 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(100, "Location must not exceed 100 characters"),
  skills: z.string().trim().min(1, "Skills are required"),
  workType: z.enum(["full-time", "part-time", "contract"]),
  category: z.string().trim().min(1, "Category is required"),
  salary: z.string().trim().min(1, "Salary is required"),
  applyLink: z
    .string()
    .trim()
    .min(1, "Apply Link is required")
    .url("Invalid URL"),
  jobType: z.enum(["onsite", "remote"]),
});

// SCHEMA VALIDATIONS FOR FORMS
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type CreateReferJobSchemaType = z.infer<typeof createReferJobSchema>;

// UPDATE USER PROFILE SCHEMA
export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(32, "Username must not exceed 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, _ , - and numbers ",
    ),
  displayName: z
    .string()
    .trim()
    .min(1, "Display Name is required")
    .max(100, "Display Name must not exceed 100 characters"),
  bio: z.string().trim().max(160, "Bio must not exceed 160 characters"),
  location: z
    .string()
    .trim()
    .max(100, "Location must not exceed 100 characters"),
  skills: z
    .array(
      z.string().trim().max(100, "Each skill must not exceed 100 characters"),
    )
    .max(10, "You can specify up to 10 skills"), // Optional: limit the number of skills
  yearOfGrad: z.coerce
    .number()
    .min(4, "Year of Graduation must not less than 4 characters")
    .max(4, "Year of Graduation must not exceed 4 characters"),
});

// SCHEMA VALIDATIONS FOR FORMS
export type UpdateUserProfileSchemaType = z.infer<
  typeof updateUserProfileSchema
>;

// CREATE INTRENSHIP SCHEMA
export const createReferInternshipSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(100, "Company must not exceed 100 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(100, "Location must not exceed 100 characters"),
  skills: z.string().trim().min(1, "Skills are required"),
  workType: z.enum(["onsite", "remote"]),
  category: z.string().trim().min(1, "Category is required"),
  stipend: z.coerce.number().min(1, "Salary is required"),
  duration: z.coerce.number().min(1, "Duration is required"),
  applyLink: z
    .string()
    .trim()
    .min(1, "Apply Link is required")
    .url("Invalid URL"),
});

// SCHEMA VALIDATIONS FOR FORMS
export type CreateReferInternshipSchemaType = z.infer<
  typeof createReferInternshipSchema
>;

// CREATE EVENT SCHEMA
export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must not exceed 1000 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(100, "Location must not exceed 100 characters"),
  date: z.date().min(new Date(), "Date must be in the future"),
  type: z.enum(["workshop", "seminar", "conference", "webinar", "reunion"]),
  time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  registrationLink: z
    .string()
    .trim()
    .min(1, "Registration Link is required")
    .url("Invalid URL")
    .optional(),
  mediaIds: z.array(z.string()).max(2, "Max 2 attachemnt per event"),
});

// SCHEMA VALIDATIONS FOR FORMS
export type CreateEventSchemaType = z.infer<typeof createEventSchema>;
