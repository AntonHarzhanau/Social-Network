import type { FieldNamesMarkedBoolean } from "react-hook-form";
import type {
  PatchProfileSettingsPayload,
  MaritalStatus,
  UserPrivacySettings,
} from "@/entities/user/model/types";
import type { EditProfileForm } from "../model/schema";

const toNull = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return t === "" ? null : t;
};

export function patchFromDirty(
  values: EditProfileForm,
  dirty: FieldNamesMarkedBoolean<EditProfileForm>,
): PatchProfileSettingsPayload | null {
  const payload: PatchProfileSettingsPayload = {};

  if (dirty.profile) {
    const p: NonNullable<PatchProfileSettingsPayload["profile"]> = {};

    if (dirty.profile.username) p.username = values.profile.username.trim();
    if (dirty.profile.location) p.location = toNull(values.profile.location);
    if (dirty.profile.bio) p.bio = toNull(values.profile.bio);

    if (dirty.profile.maritalStatus) {
      p.maritalStatus =
        values.profile.maritalStatus === ""
          ? null
          : (values.profile.maritalStatus as MaritalStatus);
    }

    if (dirty.profile.dateOfBirth) {
      if (values.profile.dateOfBirth)
        p.dateOfBirth = values.profile.dateOfBirth;
    }

    if (Object.keys(p).length) payload.profile = p;
  }

  if (dirty.privacy) {
    const pr: Partial<UserPrivacySettings> = {};
    if (dirty.privacy.postsVisibility)
      pr.postsVisibility = values.privacy.postsVisibility;
    if (dirty.privacy.mediaVisibility)
      pr.mediaVisibility = values.privacy.mediaVisibility;
    if (dirty.privacy.friendsVisibility)
      pr.friendsVisibility = values.privacy.friendsVisibility;
    if (dirty.privacy.profileVisibility)
      pr.profileVisibility = values.privacy.profileVisibility;
    if (dirty.privacy.groupsVisibility)
      pr.groupsVisibility = values.privacy.groupsVisibility;

    if (Object.keys(pr).length) payload.privacy = pr;
  }

  return payload.profile || payload.privacy ? payload : null;
}
