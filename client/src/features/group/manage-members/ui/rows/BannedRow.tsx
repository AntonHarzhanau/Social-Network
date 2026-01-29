import { Button } from "@/shared/components/ui/button";
import type { GroupMember } from "@/entities/group/model/types";
import { GroupMemberRowBase } from "./GroupMemberRowBase";

export function BannedRow(props: {
  member: GroupMember;
  disabled: boolean;
  onUnban: () => void;
}) {
  return (
    <GroupMemberRowBase
      member={props.member}
      subtitle="banned"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={props.onUnban}
          disabled={props.disabled}
        >
          Unban
        </Button>
      }
    />
  );
}
