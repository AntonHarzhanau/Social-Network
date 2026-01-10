import { ROUTES } from "@/shared/constants/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import RouteErrorPage from "@/app/router/RouteErrorPage";
import ProtectedRoot from "@/app/router/ProtectedRoot";
import { requireAuthLoader } from "@/app/router/requireAuthLoader";
import FullScreenLoader from "@/shared/components/FullScreenLoader";
import { guestLoader } from "./guestLoader";

export const router = createBrowserRouter([
  {
    path: ROUTES.AUTH,
    loader: guestLoader,
    lazy: async () => {
      const { default: Component } = await import("@/pages/AuthPage");
      return { Component };
    },
    HydrateFallback: FullScreenLoader,
    errorElement: <RouteErrorPage />,
  },
  {
    path: ROUTES.HOME,
    loader: requireAuthLoader,
    element: <ProtectedRoot />,
    HydrateFallback: FullScreenLoader,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, loader: () => redirect(ROUTES.FEEDS) },
      { path: ROUTES.FEEDS, lazy: () => import("@/pages/FeedsPage") },
      { path: ROUTES.PROFILE, lazy: () => import("@/pages/ProfilePage") },
      { path: ROUTES.CHAT, lazy: () => import("@/pages/ChatPage") },
      { path: ROUTES.FRIENDS, lazy: () => import("@/pages/FriendsPage") },
      { path: ROUTES.GROUPS, lazy: () => import("@/pages/GroupsPage") },
      { path: ROUTES.GROUP, lazy: () => import("@/pages/GroupPage") },
      { path: ROUTES.SETTINGS, lazy: () => import("@/pages/SettingsPage") },
      { path: "*", lazy: () => import("@/pages/NotFoundPage") },
    ],
  },
]);
