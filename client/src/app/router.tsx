import { ROUTES } from "@/shared/constants/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import { lazy } from "react";

const AuthPage = lazy(() => import("@/pages/AuthPage"));
const Layout = lazy(() => import("@/widgets/Layout/Layout"));

export const router = createBrowserRouter([
  {
    element: <AuthPage />,
    path: ROUTES.AUTH,
  },
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    path: "/",
    children: [
      {
        index: true,
        loader: () => redirect(ROUTES.FEEDS),
      },
      {
        path: ROUTES.FEEDS,
        lazy: () => import("@/pages/FeedsPage"),
      },
      {
        path: ROUTES.PROFILE,
        lazy: () => import("@/pages/ProfilePage"),
      },
      {
        path: ROUTES.MESSAGES,
        lazy: () => import("@/pages/MessagesPage"),
      },
      {
        path: ROUTES.CHAT,
        lazy: () => import("@/pages/ChatPage"),
      },
      {
        path: ROUTES.FRIENDS,
        lazy: () => import("@/pages/FriendsPage"),
      },
      {
        path: ROUTES.GROUPS,
        lazy: () => import("@/pages/GroupsPage"),
      },
      {
        path: ROUTES.SETTINGS,
        lazy: () => import("@/pages/SettingsPage"),
      },
    ],
  },
]);
