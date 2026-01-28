import type { ChatMemberRole } from "../model/types";

export function roleLabel(r: ChatMemberRole) {
  if (r === "owner") return "Owner";
  if (r === "admin") return "Admin";
  return "Member";
}
