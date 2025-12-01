import AuthPage from "@/pages/AuthPage";
import FeedsPage from "@/pages/FeedsPage";
import FriendsPage from "@/pages/FriendsPage";
import GroupsPage from "@/pages/GroupsPage";
import MessagesPage from "@/pages/MessagesPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import { ROUTES } from "@/shared/constants/routes";
import Layout from "@/widgets/Layout/Layout";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AuthGuard from "./AuthGuard";

export const routes = createRoutesFromElements(
  <>
    <Route
      path={ROUTES.AUTH}
      element={
        <AuthGuard mode="public">
          <AuthPage />
        </AuthGuard>
      }
    />

    <Route
      path="/"
      element={
        <AuthGuard mode="private">
          <Layout />
        </AuthGuard>
      }
    >
      <Route index element={<FeedsPage />} />
      <Route path={ROUTES.FEEDS} element={<FeedsPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
      <Route path={ROUTES.FRIENDS} element={<FriendsPage />} />
      <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </>,
);
export const router = createBrowserRouter(routes);
