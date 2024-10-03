import { Prisma, User } from "@prisma/client";

// GET USER DATA
export function getUserData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    bio: true,
    location: true,
    yearOfGrad: true,
    isAlumni: true,
    isMentor: true,
    createdAt: true,
    avatarUrl: true,
    skills: true,
    _count: {
      select: {
        projects: true,
        researchPapers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

// TYPE OF USER DATA
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserData>;
}>;

// USER PAGE
export interface UserPage {
  users: UserData[];
  nextCursor: string | null;
}

// GET REFER JOB DATA
export function getReferJobData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
  } satisfies Prisma.ReferJobInclude;
}

// TYPE OF JOB DATA
export type ReferJobData = Prisma.ReferJobGetPayload<{
  include: ReturnType<typeof getReferJobData>;
}>;

// REFER JOB PAGE
export interface ReferJobPage {
  referJobs: ReferJobData[];
  nextCursor: string | null;
}

// GET REFER INTERNSHIP DATA
export function getReferInternshipData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
  } satisfies Prisma.ReferInternshipInclude;
}

// TYPE OF INTERNSHIP DATA
export type ReferInternshipData = Prisma.ReferInternshipGetPayload<{
  include: ReturnType<typeof getReferInternshipData>;
}>;

// REFER INTERNSHIP PAGE
export interface ReferInternshipPage {
  referInternships: ReferInternshipData[];
  nextCursor: string | null;
}

// GET EVENT DATA
export function getEventData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
    attachments: true,
  } satisfies Prisma.EventInclude;
}

// TYPE OF EVENT DATA
export type EventData = Prisma.EventGetPayload<{
  include: ReturnType<typeof getEventData>;
}>;

// EVENT PAGE
export interface EventPage {
  events: EventData[];
  nextCursor: string | null;
}

// Define the interface for the data object
export interface AlumniData {
  alumni: User[]; // Replace AlumniType with the actual type of alumni
  totalPages: number;
  hasNextPage: boolean;
}




// // GET NOTIFICATION DATA
// export const getNotificationsData = {
//   issuer: {
//     select: {
//       username: true,
//       name: true,
//       avatarUrl: true,
//     },
//   },
//   post: {
//     select: {
//       content: true,
//     },
//   },
// } satisfies Prisma.NotificationInclude;

// // TYPE OF NOTIFICATION DATA
// export type NotificationData = Prisma.NotificationGetPayload<{
// include: typeof getNotificationsData;
// }>;

// // TYPE OF NOTIFICATION PAGE
// // export interface NotificationPage {
//   notifications: NotificationData[];
//   nextCursor: string | null;
// // }

// NOTIFICATION UNREAD COUNT TYPE
export interface NotificationUnreadCount {
  unreadCount: number;
}

// STREAM MSG UNREAD COUNT TYPE
export interface StreamMessageUnreadCount {
  unreadCount: number;
}
