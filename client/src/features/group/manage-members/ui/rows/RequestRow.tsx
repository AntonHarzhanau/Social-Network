import { Button } from "@/shared/components/ui/button";
import type { GroupMember } from "@/entities/group/model/types";
import { GroupMemberRowBase } from "./GroupMemberRowBase";

export function RequestRow(props: {
  member: GroupMember;
  disabled: boolean;
  onAccept: () => void;
  onReject: () => void;
  onBan: () => void;
}) {
  return (
    <GroupMemberRowBase
      member={props.member}
      subtitle="pending"
      actions={
        <>
          <Button size="sm" onClick={props.onAccept} disabled={props.disabled}>
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={props.onReject}
            disabled={props.disabled}
          >
            Reject
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={props.onBan}
            disabled={props.disabled}
          >
            Ban
          </Button>
        </>
      }
    />
  );
}
