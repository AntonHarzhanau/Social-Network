export const postKeys = {
  all: ["posts"] as const,

  lists: () => [...postKeys.all, "lists"] as const,

  infinite: (
    args:
      | { scope: "mixed"; limit: number }
      | { scope: "wall"; wallId: string; limit: number },
  ) =>
    args.scope === "mixed"
      ? [...postKeys.lists(), "mixed", { limit: args.limit }] as const
      : [...postKeys.lists(), "wall", args.wallId, { limit: args.limit }] as const,

  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
};
