export const mediaKeys = {
  all: ["media"] as const,
  detail: (id: string) => [...mediaKeys.all, "detail", id] as const,
};
