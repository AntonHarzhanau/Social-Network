export interface UserPreview {
  id: string;
  username: string;
  avatarUrl?: string | null;
  slug?: string | null;
}

export interface UserProfile extends UserPreview {
  coverUrl: string;
  location: string;
  bio: string;
  maritalStatus: string;
  dateOfBirth: string;
}
