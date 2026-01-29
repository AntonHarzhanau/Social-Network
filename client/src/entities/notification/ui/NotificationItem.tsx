import type { ReactElement } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import { Avatar } from "@/shared/components/Avatar";
import { cn } from "@/shared/lib/utils";
import type { AppNotification } from "../model/types";

type Props = {
  n: AppNotification;
  to?: string | null;
  onClick?: () => void;
  variant?: "toast" | "list";
  showTime?: boolean;
};

export function NotificationItem({
  n,
  to,
  onClick,
  variant = "list",
  showTime = false,
}: Props): ReactElement {
  const inRouter = useInRouterContext();
  const canUseLink = !!to && inRouter && variant !== "toast";

  const name = n.source?.name ?? "Notification";
  const avatarUrl = n.source?.avatarUrl ?? null;
  const groupCount = n.group?.count ?? 1;

  const Root: any = canUseLink ? Link : "button";
  const rootProps = canUseLink
    ? { to, onClick }
    : { type: "button" as const, onClick };

  return (
    <Root
      {...rootProps}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border bg-background px-3 py-2 text-left shadow-sm hover:bg-accent transition",
        variant === "toast" && "border-muted",
      )}
    >
      <Avatar
        imageUrl={avatarUrl ?? undefined}
        name={name}
        className="w-10 h-10"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-medium">{name}</div>
          {groupCount > 1 && (
            <div className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {groupCount}
            </div>
          )}
        </div>

        <div className="truncate text-sm text-muted-foreground">{n.text}</div>

        {showTime && (
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </Root>
  );
}
