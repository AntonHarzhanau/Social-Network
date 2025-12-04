import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/shared/store/authStore";
import { Navigate } from "react-router-dom";


interface AuthGuardProps {
  children: React.ReactNode;
}
const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
