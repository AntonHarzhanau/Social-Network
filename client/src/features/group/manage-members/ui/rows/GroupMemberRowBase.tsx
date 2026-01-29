import { Avatar } from "@/shared/components/Avatar";
import type { GroupMember } from "@/entities/group/model/types";

export function GroupMemberRowBase(props: {
  member: GroupMember;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { member, subtitle, actions } = props;

  return (
    <div className="flex items-center gap-3">
      <Avatar
        imageUrl={member.user.avatarUrl ?? undefined}
        name={member.user.name}
        className="w-12 h-12"
      />

      <div className="flex min-w-0 flex-col">
        <div className="text-sm font-medium truncate">{member.user.name}</div>

        {subtitle ? (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>

      {actions ? (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
