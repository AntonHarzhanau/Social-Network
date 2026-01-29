import { friendsQueryKeys } from "@/entities/friends/model/queryKeys";
import type { NotificationHandler } from "./types";
import type { FriendRequestCreatedNotification } from "../../model/types";
import { ROUTES } from "@/shared/constants/routes";

export const friendRequestCreatedHandler: NotificationHandler<FriendRequestCreatedNotification> =
  {
    type: "friend_request_created",

    getLink: () => ROUTES.FRIENDS,

    onReceive: (_n, ev, ctx) => {
      if (ev.action === "created") {
        ctx.qc.invalidateQueries({ queryKey: friendsQueryKeys.stats.me() });
      }
      return { showToast: ev.action === "created" };
    },

    onClick: (_n, ctx) => {
      ctx.setFriendsFilter("received");
    },
  };
