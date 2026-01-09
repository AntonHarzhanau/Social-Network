export type Group = {
  id: string;
  name: string;
  slug?: string | undefined | null;
  avatarUrl?: string | undefined | null;
  subscribersCount: number;
};


// export type GroupDetails = Group & {
//   description?: string | undefined | null;
//   isSubscribedByCurrentUser: boolean;
// };
