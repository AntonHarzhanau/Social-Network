import { sessionStore } from "@/entities/session/model/sessionStore";
import { authActions } from "@/features/auth/model/authActions";
import { ROUTES } from "@/shared/constants/routes";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";

export async function requireAuthLoader({ request }: LoaderFunctionArgs) {
  const { user, status } = sessionStore.getState();

  if (user && status === "ready") return null;

  await authActions.checkAuth();

  const st = sessionStore.getState();
  const isAuth = !!st.user && st.status === "ready";
  if (isAuth) return null;

  const url = new URL(request.url);
  const intended = `${url.pathname}${url.search}${url.hash}`;

  return redirect(`${ROUTES.AUTH}?redirectTo=${encodeURIComponent(intended)}`);
}
