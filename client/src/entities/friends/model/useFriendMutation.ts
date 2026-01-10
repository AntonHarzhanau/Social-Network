import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/entities/friends/api/friends";
import { PEOPLE_KEY } from "./queryKeys";

function invalidatePeople(qc: ReturnType<typeof useQueryClient>) {
  return qc.invalidateQueries({ queryKey: PEOPLE_KEY });
}

export function useSendFriendRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => sendFriendRequest(userId),
    onSuccess: () => invalidatePeople(qc),
  });
}

export function useCancelFriendRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => cancelFriendRequest(userId),
    onSuccess: () => invalidatePeople(qc),
  });
}

export function useAcceptFriendRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => acceptFriendRequest(userId),
    onSuccess: () => invalidatePeople(qc),
  });
}

export function useDeclineFriendRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => declineFriendRequest(userId),
    onSuccess: () => invalidatePeople(qc),
  });
}

export function useRemoveFriendMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeFriend(userId),
    onSuccess: () => invalidatePeople(qc),
  });
}
