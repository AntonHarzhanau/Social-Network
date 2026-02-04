import type { PostFilterType } from "@/features/post/post-filter/model/usePostFilterStore";

export const postKeys = {
  all: ["posts"] as const,

  lists: () => [...postKeys.all, "lists"] as const,

  infinite: (
    args:
      | { scope: "mixed"; limit: number; filter: PostFilterType }
      | {
          scope: "wall";
          wallId: string;
          limit: number;
          filter: PostFilterType;
        },
  ) =>
    args.scope === "mixed"
      ? ([
          ...postKeys.lists(),
          "mixed",
          { limit: args.limit, filter: args.filter },
        ] as const)
      : ([
          ...postKeys.lists(),
          "wall",
          args.wallId,
          { limit: args.limit, filter: args.filter },
        ] as const),

  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
};
