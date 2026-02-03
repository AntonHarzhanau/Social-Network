export type MediaOwnerKind = "user" | "group";
export type MediaKind = "image" | "video";

export const mediaBoxKeys = {
  all: ["mediaBox"] as const,

  list: (owner: { kind: MediaOwnerKind; id: string }, type: MediaKind) =>
    [...mediaBoxKeys.all, "list", owner.kind, owner.id, type] as const,
};
