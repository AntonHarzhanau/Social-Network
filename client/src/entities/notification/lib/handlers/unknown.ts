import type { NotificationHandler } from "./types";
import type { AppNotification } from "../../model/types";

export const unknownHandler: NotificationHandler<AppNotification> = {
  type: "*",
  getLink: () => null,
  onReceive: (_n, _ev, _ctx) => ({ showToast: true }),
};
