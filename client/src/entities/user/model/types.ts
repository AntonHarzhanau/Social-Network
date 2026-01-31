export type ProfileVisibility = "public" | "friends" | "private";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export interface UserPreview {
  id: string;
  name: string;
  avatarUrl?: string | null;
  slug?: string | null;
  wallId?: string | null;
  lastLoginAt?: string | null;
  isOnline: boolean;
}

export interface UserPublicProfile {
  id: string;
  name: string;
  slug?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  isOnline: boolean;
}

export interface EducationPreview {
  id: string;
  institutionName: string;
  programName?: string | null;
  degree?: string | null;
  startAt: string;
  endAt: string | null;
}

export interface WorkExperiencePreview {
  id: string;
  company: string;
  positionTitle?: string | null;
  startAt: string;
  endAt: string | null;
}

export interface UserPrivateProfileSummary {
  location?: string | null;
  wallId: string;
  currentEducation?: EducationPreview | null;
  currentWorkExperience?: WorkExperiencePreview | null;
}

export interface UserProfileResponse {
  public: UserPublicProfile;
  privateSummary?: UserPrivateProfileSummary | null;
  canViewPrivateSummary: boolean;
  canViewMore: boolean;
}

export interface UserPrivateProfileDetails {
  dateOfBirth: string;
  maritalStatus?: MaritalStatus | null;
  location?: string | null;
  bio?: string | null;
  workExperiences: WorkExperiencePreview[];
  educations: EducationPreview[];
}

export type EducationUpsertInput = {
  institutionName: string;
  programName?: string | null;
  degree?: string | null;
  startAt: string;
  endAt?: string | null;
};

export type WorkExperienceUpsertInput = {
  company: string;
  positionTitle?: string | null;
  startAt: string;
  endAt?: string | null;
};

export type IdResponse = { id: string };

export interface UserPrivacySettings {
  postsVisibility: ProfileVisibility;
  mediaVisibility: ProfileVisibility;
  friendsVisibility: ProfileVisibility;
  profileVisibility: ProfileVisibility;
  groupsVisibility: ProfileVisibility;
}

export type PatchProfileSettingsPayload = {
  profile?: Partial<{
    username: string;
    location: string | null;
    maritalStatus: MaritalStatus | null;
    dateOfBirth: string;
    bio: string | null;
  }>;
  privacy?: Partial<UserPrivacySettings>;
};
