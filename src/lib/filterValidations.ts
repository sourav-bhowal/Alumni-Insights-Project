import { z } from "zod";

export const filterReferJobSchema = z.object({
  q: z.string().optional(),
  workType: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salary: z.string().optional(),
});

export type FilterReferJob = z.infer<typeof filterReferJobSchema>;