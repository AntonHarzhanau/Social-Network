import type {
  GroupMember,
  MemberRole,
  MemberStatus,
} from "@/entities/group/model/types";
import type { UserPreview } from "@/entities/user/model/types";

const roles: MemberRole[] = ["owner", "admin", "member"];
const statuses: Array<MemberStatus | null> = [
  "accepted",
  "pending",
  "banned",
  null,
];

const fakeUsers: Array<
  Pick<UserPreview, "id" | "name" | "avatarUrl" | "isOnline">
> = [
  { id: "u-001", name: "Anton Petrov", avatarUrl: null, isOnline: true },
  { id: "u-002", name: "Maria Ivanova", avatarUrl: null, isOnline: false },
  { id: "u-003", name: "Nikita Smirnov", avatarUrl: null, isOnline: true },
  { id: "u-004", name: "Elena Kozlova", avatarUrl: null, isOnline: false },
  { id: "u-005", name: "Ilya Sokolov", avatarUrl: null, isOnline: true },
  { id: "u-006", name: "Daria Morozova", avatarUrl: null, isOnline: false },
  { id: "u-007", name: "Sergey Volkov", avatarUrl: null, isOnline: true },
  { id: "u-008", name: "Alina Orlova", avatarUrl: null, isOnline: false },
  { id: "u-009", name: "Pavel Lebedev", avatarUrl: null, isOnline: true },
  { id: "u-010", name: "Olga Romanova", avatarUrl: null, isOnline: false },
  { id: "u-011", name: "Denis Popov", avatarUrl: null, isOnline: true },
  { id: "u-012", name: "Ksenia Pavlova", avatarUrl: null, isOnline: false },
  { id: "u-013", name: "Andrey Fedorov", avatarUrl: null, isOnline: true },
  { id: "u-014", name: "Sofia Kuznetsova", avatarUrl: null, isOnline: false },
  { id: "u-015", name: "Maxim Egorov", avatarUrl: null, isOnline: true },
  { id: "u-016", name: "Polina Alexeeva", avatarUrl: null, isOnline: false },
  { id: "u-017", name: "Artem Gusev", avatarUrl: null, isOnline: true },
  { id: "u-018", name: "Yulia Belova", avatarUrl: null, isOnline: false },
  { id: "u-019", name: "Viktor Tarasov", avatarUrl: null, isOnline: true },
  { id: "u-020", name: "Irina Mikhailova", avatarUrl: null, isOnline: false },
];

export const FAKE_GROUP_MEMBERS: GroupMember[] = fakeUsers.map((u, i) => ({
  id: `gm-${String(i + 1).padStart(3, "0")}`,
  user: u as UserPreview,
  role: roles[i === 0 ? 0 : i % roles.length],
  status: i === 0 ? "accepted" : statuses[i % statuses.length],
}));
