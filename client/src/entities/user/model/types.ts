export interface UserPreview {
  id: string;
  username: string;
  avatarUrl?: string | null;
  slug?: string | null;
  wallId?: string | null;
}

export interface UserProfile extends UserPreview {
  id: string;
  email: string;
  username: string;
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
