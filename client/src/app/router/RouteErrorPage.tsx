import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorPage() {
  const err = useRouteError();

  if (isRouteErrorResponse(err)) {
    return (
      <div className="p-6">
        <div className="text-lg font-semibold">Route error</div>
        <div className="opacity-70">
          {err.status} {err.statusText}
        </div>
      </div>
    );
  }

  const message = err instanceof Error ? err.message : "Unknown error";

  return (
    <div className="p-6">
      <div className="text-lg font-semibold">Unexpected error</div>
      <div className="opacity-70">{message}</div>
    </div>
  );
}
