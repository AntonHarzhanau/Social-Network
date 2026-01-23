import {
  isAuthenticated,
  sessionStatus,
} from "@/entities/session/model/sessionStore";
import FullScreenLoader from "@/shared/components/FullScreenLoader";
import { ROUTES } from "@/shared/constants/routes";
import Layout from "@/widgets/Layout/Layout";
import { Navigate } from "react-router-dom";
import AuthEventBridge from "./AuthEventBridge";
import { NotificationsMercureBridge } from "@/entities/notification/model/NotificationMercureBridge";

const ProtectedRoot = () => {
  const status = sessionStatus();
  const isAuth = isAuthenticated();
  if (status === "loading") {
    return <FullScreenLoader />;
  }
  if (!isAuth) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return (
    <>
      <AuthEventBridge />
      <NotificationsMercureBridge />
      <Layout />
    </>
  );
};

export default ProtectedRoot;
