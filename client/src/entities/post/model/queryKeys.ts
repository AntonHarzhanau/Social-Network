export const postKeys = {
  all: ["posts"] as const,

  lists: () => [...postKeys.all, "lists"] as const,
  
  list: (params: { authorId: string | null; limit: number }) =>
    [...postKeys.lists(), params] as const,

  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
};
