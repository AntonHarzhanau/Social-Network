export interface UserPreview {
  id: string;
  name: string;
  avatarUrl?: string | null;
  slug?: string | null;
  wallId?: string | null;
}

export interface UserProfile extends UserPreview {
  id: string;
  email: string;
  name: string;
  slug: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string | null;
  maritalStatus: string | null;
  bio: string | null;
  dateOfBirth: string;
  createdAt: string;
  emailVerifiedAt: string;
  lastLoginAt: string | null;
  wallId: string;
}
