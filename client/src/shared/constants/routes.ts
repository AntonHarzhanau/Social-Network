export const ROUTES = {
  AUTH: "/auth",
  HOME: "/",
  PROFILE: "/profile/:userId",
  FEEDS: "/feeds",
  FRIENDS: "/friends",
  CHAT: "/chats/:chatId?",
  GROUPS: "/groups",
  GROUP: "/group/:groupId",
  SETTINGS: "/settings",
} as const;

export type PathParams = {
  [ROUTES.GROUP]: {
    groupId: string;
  };
  [ROUTES.PROFILE]: {
    userId: string;
  };
    [ROUTES.CHAT]: {
    chatId?: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
