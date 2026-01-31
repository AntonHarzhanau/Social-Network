import { Avatar } from "@/shared/components/Avatar";
import { Item } from "@/shared/components/ui/item";
import { Button } from "@/shared/components/ui/button";

import type { ChatMember } from "@/entities/chat/model/types";
import type { ChatPermissions, PendingRoleChange } from "../model/types";

import { RoleCell } from "./RoleCell";

export function MemberRow(props: {
  member: ChatMember;
  perms: ChatPermissions;

  onRemove: () => void;
  removePending: boolean;

  onRequestRoleChange: (p: PendingRoleChange) => void;
}) {
  const role = props.member.role;

  return (
    <Item className="justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar
          imageUrl={props.member.avatarUrl}
          name={props.member.name}
          className="h-10 w-10"
        />
        <div className="min-w-0">
          <p className="truncate">{props.member.name}</p>

          <RoleCell
            role={role}
            canChange={props.perms.canChangeRoleFor(props.member.id, role)}
            onPick={(next) => {
              props.onRequestRoleChange({
                userId: props.member.id,
                userName: props.member.name,
                from: role,
                to: next,
              });
            }}
          />
        </div>
      </div>

      {props.perms.canRemove(props.member.id, role) && (
        <Button
          variant="ghost"
          className="ml-auto text-red-500 hover:text-red-700"
          disabled={props.removePending}
          onClick={props.onRemove}
        >
          Remove
        </Button>
      )}
    </Item>
  );
}
