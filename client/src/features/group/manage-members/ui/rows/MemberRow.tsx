import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { GroupMember } from "@/entities/group/model/types";
import { GroupMemberRowBase } from "./GroupMemberRowBase";

export function MemberRow(props: {
  member: GroupMember;
  canChangeRole: boolean;
  canBan: boolean;
  disabled: boolean;
  onChangeRole: (nextRole: "admin" | "member") => void;
  onBan: () => void;
}) {
  const { member } = props;

  const subtitle = member.role === "owner" ? "owner" : null;

  const actions =
    member.role === "owner" ? (
      props.canBan ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={props.onBan}
          disabled={props.disabled}
        >
          Ban
        </Button>
      ) : null
    ) : (
      <>
        <Select
          value={(member.role ?? "member") as "admin" | "member"}
          onValueChange={(v) => props.onChangeRole(v as "admin" | "member")}
          disabled={!props.canChangeRole || props.disabled}
        >
          <SelectTrigger className="h-7 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="member">member</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {props.canBan && (
          <Button
            variant="destructive"
            size="sm"
            onClick={props.onBan}
            disabled={props.disabled}
          >
            Ban
          </Button>
        )}
      </>
    );

  return (
    <GroupMemberRowBase member={member} subtitle={subtitle} actions={actions} />
  );
}
