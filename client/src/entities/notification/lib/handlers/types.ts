import type { QueryClient } from "@tanstack/react-query";
import type { Location } from "react-router-dom";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AppNotification, NotificationEvent } from "../../model/types";
import type { FriendsFilterState } from "@/entities/friends/model/useFriendsFilterStore";

export type HandlerCtx = {
  qc: QueryClient;
  location: Location;
  ackOne: UseMutationResult<void, Error, { id: string }, any>;
  setFriendsFilter: FriendsFilterState["setFilter"];
};

export type ReceiveDecision = {
  showToast?: boolean; // default: true
  autoAck?: boolean; // default: false
};

export type NotificationHandler<T extends AppNotification = AppNotification> = {
  type: string; // key
  getLink: (n: T) => string | null;
  onReceive: (n: T, ev: NotificationEvent, ctx: HandlerCtx) => ReceiveDecision;
  onClick?: (n: T, ctx: HandlerCtx) => void;
};
