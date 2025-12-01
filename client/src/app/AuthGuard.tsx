import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/shared/store/authStore";
import { Navigate } from "react-router-dom";

type GuardMode = "private" | "public";

interface AuthGuardProps {
    mode: GuardMode;
    children: React.ReactNode;
}
const AuthGuard = ({ mode, children }: AuthGuardProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log("AuthGuard - isAuthenticated:", isAuthenticated, "mode:", mode);


    if (mode === 'private' && !isAuthenticated) {
        return <Navigate to={ROUTES.AUTH} replace />;
    }
    if (mode === 'public' && isAuthenticated) {
        return <Navigate to={ROUTES.FEEDS} replace />;
    }
    return (
    <>{children}</>
  )
}

export default AuthGuard
