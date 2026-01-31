import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchMyProfileSettings,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  deleteProfile,
  attachMyMedia,
} from "@/entities/user/api/userApi";
import { invalidateUserProfile } from "@/entities/user/model/invalidateUserProfile";
import type {
  PatchProfileSettingsPayload,
  EducationUpsertInput,
  WorkExperienceUpsertInput,
} from "@/entities/user/model/types";

export function usePatchMyProfileSettingsMutation(params: {
  myUserId: string;
}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PatchProfileSettingsPayload) =>
      patchMyProfileSettings(payload),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useAttachMyMediaMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (mediaIds: string[]) => attachMyMedia(mediaIds),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useAddEducationMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: EducationUpsertInput) => addEducation(input),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useUpdateEducationMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { educationId: string; input: EducationUpsertInput }) =>
      updateEducation(vars.educationId, vars.input),
    onSuccess: () => {
      invalidateUserProfile(qc, params.myUserId);
    },
  });
}

export function useDeleteEducationMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) => deleteEducation(educationId),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useAddWorkExperienceMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: WorkExperienceUpsertInput) => addWorkExperience(input),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useUpdateWorkExperienceMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      workExperienceId: string;
      input: WorkExperienceUpsertInput;
    }) => updateWorkExperience(vars.workExperienceId, vars.input),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useDeleteWorkExperienceMutation(params: { myUserId: string }) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (workExperienceId: string) =>
      deleteWorkExperience(workExperienceId),
    onSuccess: () => invalidateUserProfile(qc, params.myUserId),
  });
}

export function useDeleteMyProfileMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProfile(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["users"] });
    },
  });
}
