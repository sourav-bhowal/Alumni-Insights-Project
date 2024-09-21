import { Prisma } from "@prisma/client";

// GET USER DATA
export function getUserData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    bio: true,
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








// GET NOTIFICATION DATA
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

// TYPE OF NOTIFICATION DATA
// export type NotificationData = Prisma.NotificationGetPayload<{
  // include: typeof getNotificationsData;
// }>;

// TYPE OF NOTIFICATION PAGE
// // export interface NotificationPage {
//   notifications: NotificationData[];
//   nextCursor: string | null;
// // }

// // NOTIFICATION UNREAD COUNT TYPE
// export interface NotificationUnreadCount {
//   unreadCount: number;
// }

// // STREAM MSG UNREAD COUNT TYPE
// export interface StreamMessageUnreadCount {
//   unreadCount: number;
// }