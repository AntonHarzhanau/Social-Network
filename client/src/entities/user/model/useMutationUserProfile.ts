import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../api/userApi";
import type { UserProfile } from "./types";


export const useMutationUserProfile = (data: UserProfile, userId: string) => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
};
