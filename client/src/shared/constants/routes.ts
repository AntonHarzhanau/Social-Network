export const ROUTES = {
  AUTH: "/auth",
  REGISTER: "/register",
  PROFILE: "/profile",
  FEEDS: "/feeds",
  FEED: "/feeds/:feedid",
  FRIENDS: "/friends",
  MESSAGES: "/messages",
  GROUPS: "/groups",
  SETTINGS: "/settings",
} as const;

export type PathParams = {
  [ROUTES.FEED]: {
    feedid: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
