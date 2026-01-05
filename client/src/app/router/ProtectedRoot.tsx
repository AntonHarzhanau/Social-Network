import { useAuthStore } from "@/features/auth/model/authStore"
import { ROUTES } from "@/shared/constants/routes";
import Layout from "@/widgets/Layout/Layout";
import { Navigate } from "react-router-dom";

const ProtectedRoot = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH} replace />;
    }
  return <Layout />;
}

export default ProtectedRoot
