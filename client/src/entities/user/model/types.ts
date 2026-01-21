export interface UserPreview {
  id: string;
  name: string;
  avatarUrl?: string | null;
  slug?: string | null;
  wallId?: string | null;
  lastLoginAt?: string | null;
}

export interface UserProfile extends UserPreview {
  email: string;
  coverUrl: string | null;
  location: string | null;
  maritalStatus: string | null;
  bio: string | null;
  dateOfBirth: string;
  createdAt: string;
  emailVerifiedAt: string | null;
  lastLoginAt?: string | null;
}
