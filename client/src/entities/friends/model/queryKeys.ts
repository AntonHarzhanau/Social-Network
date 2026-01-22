export const friendsQueryKeys = {
  root: ["friends"] as const,

  list: (userId: string, params: { query: string; limit: number }) =>
    [...friendsQueryKeys.root, "list", userId, params] as const,

  requests: (
    type: "sent" | "received",
    params: { query: string; limit: number },
  ) => [...friendsQueryKeys.root, "requests", type, params] as const,

  stats: (userId: string) =>
    [...friendsQueryKeys.root, "stats", userId] as const,
};
