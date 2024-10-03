import { z } from "zod";

export const filterReferJobSchema = z.object({
  q: z.string().optional(),
  workType: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salary: z.string().optional(),
});

export type FilterReferJob = z.infer<typeof filterReferJobSchema>;

export const filterMentorsSchema = z.object({
  q: z.string().optional(),
  domain: z.string().optional(),
  location: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  page: z.string().optional(),
  perPage: z.string().optional(),
});

export type FilterMentors = z.infer<typeof filterMentorsSchema>;

// export const filterAlumniSchema = z.object({
//   q: z.string().optional(),
//   domain: z.string().optional(),
//   location: z.string().optional(),
//   fieldOfStudy: z.string().optional(),
//   page: z.string().optional(),
//   perPage: z.string().optional(),
// });

// export 