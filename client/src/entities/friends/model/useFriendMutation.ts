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
import { userKeys } from "@/entities/user/model/queryKeys";
import type { MyFriendsStats } from "./types";

type Ctx = { prevMyStats?: MyFriendsStats };

function patchMyStats(
  qc: QueryClient,
  updater: (old: MyFriendsStats) => MyFriendsStats,
) {
  qc.setQueryData<MyFriendsStats>(friendsQueryKeys.stats.me(), (old) => {
    const base: MyFriendsStats = old ?? {
      total: 0,
      sentRequests: 0,
      receivedRequests: 0,
    };
    return updater(base);
  });
}

function invalidateFriends(qc: QueryClient, currentUserId?: string) {
  qc.invalidateQueries({ queryKey: friendsQueryKeys.root });

  qc.invalidateQueries({ queryKey: userKeys.all });

  qc.invalidateQueries({ queryKey: friendsQueryKeys.stats.me() });
  void currentUserId;
  //   qc.invalidateQueries({
  //     queryKey: friendsQueryKeys.stats.user(currentUserId),
  //   });
}

export function useSendFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (userId: string) => sendFriendRequest(userId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: friendsQueryKeys.stats.me() });
      const prevMyStats = qc.getQueryData<MyFriendsStats>(
        friendsQueryKeys.stats.me(),
      );

      patchMyStats(qc, (s) => ({ ...s, sentRequests: s.sentRequests + 1 }));
      return { prevMyStats };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevMyStats)
        qc.setQueryData(friendsQueryKeys.stats.me(), ctx.prevMyStats);
    },

    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useCancelFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (userId: string) => cancelFriendRequest(userId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: friendsQueryKeys.stats.me() });
      const prevMyStats = qc.getQueryData<MyFriendsStats>(
        friendsQueryKeys.stats.me(),
      );

      patchMyStats(qc, (s) => ({
        ...s,
        sentRequests: Math.max(0, s.sentRequests - 1),
      }));
      return { prevMyStats };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevMyStats)
        qc.setQueryData(friendsQueryKeys.stats.me(), ctx.prevMyStats);
    },

    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useAcceptFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (userId: string) => acceptFriendRequest(userId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: friendsQueryKeys.stats.me() });
      const prevMyStats = qc.getQueryData<MyFriendsStats>(
        friendsQueryKeys.stats.me(),
      );

      patchMyStats(qc, (s) => ({
        ...s,
        receivedRequests: Math.max(0, s.receivedRequests - 1),
        total: s.total + 1,
      }));

      return { prevMyStats };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevMyStats)
        qc.setQueryData(friendsQueryKeys.stats.me(), ctx.prevMyStats);
    },

    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useDeclineFriendRequestMutation(currentUserId?: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (userId: string) => declineFriendRequest(userId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: friendsQueryKeys.stats.me() });
      const prevMyStats = qc.getQueryData<MyFriendsStats>(
        friendsQueryKeys.stats.me(),
      );

      patchMyStats(qc, (s) => ({
        ...s,
        receivedRequests: Math.max(0, s.receivedRequests - 1),
      }));

      return { prevMyStats };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevMyStats)
        qc.setQueryData(friendsQueryKeys.stats.me(), ctx.prevMyStats);
    },

    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}

export function useRemoveFriendMutation(currentUserId?: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string, Ctx>({
    mutationFn: (userId: string) => removeFriend(userId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: friendsQueryKeys.stats.me() });
      const prevMyStats = qc.getQueryData<MyFriendsStats>(
        friendsQueryKeys.stats.me(),
      );

      patchMyStats(qc, (s) => ({ ...s, total: Math.max(0, s.total - 1) }));
      return { prevMyStats };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevMyStats)
        qc.setQueryData(friendsQueryKeys.stats.me(), ctx.prevMyStats);
    },

    onSuccess: () => invalidateFriends(qc, currentUserId),
  });
}
