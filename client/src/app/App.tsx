import Providers from "./Providers";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/router";
import { ErrorBoundary } from "react-error-boundary";

function App() {

  return (
    <Providers>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
