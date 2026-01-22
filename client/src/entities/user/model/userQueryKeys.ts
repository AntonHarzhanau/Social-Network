export const userQueryKeys = {
  root: ["userSearch"] as const,
  list: (params: { query: string; limit: number }) =>
    [...userQueryKeys.root, "list", params] as const,
};
