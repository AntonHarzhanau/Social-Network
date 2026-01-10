import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { authActions } from "@/features/auth/model/authActions";
import { sessionStore } from "@/entities/session/model/sessionStore";

function safeRedirectTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

export async function guestLoader({ request }: LoaderFunctionArgs) {
  const { user, status } = sessionStore.getState();
  if (user && status === "ready") return null;
  await authActions.checkAuth();

  const st = sessionStore.getState();
  const isAuth = !!st.user && st.status === "ready";
  if (!isAuth) return null;

  const url = new URL(request.url);
  const redirectTo = safeRedirectTo(url.searchParams.get("redirectTo"));

  return redirect(redirectTo ?? ROUTES.FEEDS);
}
