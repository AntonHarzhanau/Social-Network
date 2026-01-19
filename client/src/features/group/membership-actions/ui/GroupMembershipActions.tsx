import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";

type GroupVisibility = "public" | "private";
type GroupRole = "owner" | "admin" | "member" | null | undefined;

interface GroupMembershipActionsProps {
  isMember: boolean;
  groupVisibility: GroupVisibility;
  role?: GroupRole;

  onJoin?: () => void | Promise<void>;
  onRequestJoin?: () => void | Promise<void>;
  onLeave?: () => void | Promise<void>;
  onOpenSettings?: () => void;

  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
}

export function GroupMembershipActions({
  isMember,
  groupVisibility,
  role,
  onJoin,
  onRequestJoin,
  onLeave,
  onOpenSettings,
  loading = false,
  disabled = false,
  size = "sm",
}: GroupMembershipActionsProps) {
  const isOwner = isMember && role === "owner";
  const isMemberNotOwner = isMember && (role === "admin" || role === "member");

  if (!isMember) {
    if (groupVisibility === "public") {
      return (
        <Button
          variant="outline"
          size={size}
          onClick={onJoin}
          disabled={disabled || loading || !onJoin}
        >
          Join
        </Button>
      );
    }

    // private
    return (
      <Button
        variant="outline"
        size={size}
        onClick={onRequestJoin}
        disabled={disabled || loading || !onRequestJoin}
      >
        Request to join
      </Button>
    );
  }

  if (isOwner) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={onOpenSettings}
        disabled={disabled || !onOpenSettings}
        aria-label="Group settings"
        title="Group settings"
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  if (isMemberNotOwner) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={onLeave}
        disabled={disabled || loading || !onLeave}
      >
        Leave
      </Button>
    );
  }

  return null;
}
