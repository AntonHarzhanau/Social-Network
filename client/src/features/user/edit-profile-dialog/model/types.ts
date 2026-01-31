export type TabKey =
  | "general"
  | "privacy"
  | "security"
  | "education"
  | "workExperience";

export const TAB_LABELS: Record<TabKey, string> = {
  general: "General",
  privacy: "Privacy",
  security: "Security",
  education: "Education",
  workExperience: "Work experience",
};
