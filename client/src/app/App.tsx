import Providers from "./Providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
