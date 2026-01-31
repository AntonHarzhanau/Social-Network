// entities/user/model/hooks/useUserQueries.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserProfile,
  fetchUserProfileDetails,
  fetchUserAvatars,
  fetchUserMedias,
  fetchPrivateProfileSettings,
} from "@/entities/user/api/userApi";
import { userKeys } from "@/entities/user/model/queryKeys";
import type {
  UserProfileResponse,
  UserPrivateProfileDetails,
  UserPrivacySettings,
} from "@/entities/user/model/types";
import type { MediaPreview } from "@/entities/media/model/types";

export function useUserProfile(params: { userId: string; enabled?: boolean }) {
  const { userId, enabled = true } = params;

  return useQuery<UserProfileResponse>({
    queryKey: userKeys.profile(userId),
    queryFn: ({ signal }) => fetchUserProfile(userId, signal),
    enabled: enabled && !!userId,
    staleTime: 30_000,
  });
}

export function useUserProfileDetails(params: {
  userId: string;
  enabled?: boolean;
}) {
  const { userId, enabled = true } = params;

  return useQuery<UserPrivateProfileDetails>({
    queryKey: userKeys.profileDetails(userId),
    queryFn: ({ signal }) => fetchUserProfileDetails(userId, signal),
    enabled: enabled && !!userId,
    retry: false,
    staleTime: 30_000,
  });
}

export function useUserAvatars(params: { userId: string; enabled?: boolean }) {
  const { userId, enabled = true } = params;

  return useQuery<MediaPreview[]>({
    queryKey: userKeys.avatars(userId),
    queryFn: ({ signal }) => fetchUserAvatars(userId, signal),
    enabled: enabled && !!userId,
    staleTime: 60_000,
  });
}

export function useUserMedias(params: {
  userId: string;
  type: "image" | "video";
  enabled?: boolean;
}) {
  const { userId, type, enabled = true } = params;

  return useQuery<MediaPreview[]>({
    queryKey: userKeys.medias(userId, type),
    queryFn: ({ signal }) => fetchUserMedias(userId, type, signal),
    enabled: enabled && !!userId,
    staleTime: 60_000,
  });
}

export function useMyPrivacySettings(opts?: { enabled?: boolean }) {
  return useQuery<UserPrivacySettings>({
    queryKey: userKeys.myPrivacy(),
    queryFn: ({ signal }) => fetchPrivateProfileSettings(signal),
    enabled: opts?.enabled ?? true,
    staleTime: 30_000,
  });
}
