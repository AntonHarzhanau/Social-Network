import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/entities/friends/api/friends";
import { friendsQueryKeys } from "./queryKeys";
import { userQueryKeys } from "@/entities/user/model/userQueryKeys";

function invalidateFriends(qc: QueryClient, currentUserId?: string) {
  qc.invalidateQueries({ queryKey: friendsQueryKeys.root });
  qc.invalidateQueries({ queryKey: userQueryKeys.root });
  if (currentUserId) {
    qc.invalidateQueries({ queryKey: friendsQueryKeys.stats(currentUserId) });
  }
}

export function useSendFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => sendFriendRequest(userId),
    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useCancelFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => cancelFriendRequest(userId),
    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useAcceptFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => acceptFriendRequest(userId),
    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useDeclineFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => declineFriendRequest(userId),
    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useRemoveFriendMutation(currentUserId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeFriend(userId),
    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}
