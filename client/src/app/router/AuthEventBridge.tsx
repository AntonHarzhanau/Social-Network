import { ROUTES } from "@/shared/constants/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthEventBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      const redirectTo = encodeURIComponent(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
      navigate(`${ROUTES.AUTH}?redirectTo=${redirectTo}`, { replace: true });
    };

    window.addEventListener("auth:required", handler);
    return () => {
      window.removeEventListener("auth:required", handler);
    };
  }, [navigate]);
  return null;
};

export default AuthEventBridge;
