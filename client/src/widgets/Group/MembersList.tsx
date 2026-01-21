import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import {
  changeGroupMemberRole,
  changeGroupMemberStatus,
  fetchGroupMembers,
} from "@/entities/group/api/groupApi";
import { Avatar } from "@/shared/components/Avatar";
import type {
  GroupMember,
  MemberRole,
  MemberStatus,
} from "@/entities/group/model/types";

/* =========================
   Types
========================= */

type Props = {
  groupId: string;
  myRole: MemberRole;
  myUserId: string;
};

const MEMBERS_QK = (groupId: string, status: MemberStatus) =>
  ["groupMembers", groupId, status] as const;

type PendingAction =
  | {
      type: "changeRole";
      memberId: string;
      memberName: string;
      nextRole: "admin" | "member";
    }
  | {
      type: "remove";
      memberId: string;
      memberName: string;
    }
  | null;

/* =========================
   Hooks: permissions
========================= */

function useMemberPermissions(myRole: MemberRole, myUserId: string) {
  const canManageRequests = myRole === "owner" || myRole === "admin";

  const canChangeRole = (target: GroupMember) => {
    if (target.role === "owner") return false;
    if (target.user.id === myUserId) return false;
    return myRole === "owner" || myRole === "admin";
  };

  const canKick = (target: GroupMember) => {
    if (target.role === "owner") return false;
    if (target.user.id === myUserId) return false;

    if (myRole === "owner") return true;
    if (myRole === "admin") return target.role === "member";
    return false;
  };

  return { canManageRequests, canChangeRole, canKick };
}

/* =========================
   Hooks: queries
========================= */

function useMembersQueries(groupId: string, open: boolean) {
  const acceptedQuery = useQuery({
    queryKey: MEMBERS_QK(groupId, "accepted"),
    enabled: open && !!groupId,
    queryFn: () => fetchGroupMembers(groupId, 1, 8, "accepted"),
  });

  const pendingQuery = useQuery({
    queryKey: MEMBERS_QK(groupId, "pending"),
    enabled: open && !!groupId,
    queryFn: () => fetchGroupMembers(groupId, 1, 8, "pending"),
  });

  const accepted = acceptedQuery.data?.members ?? [];
  const pending = pendingQuery.data?.members ?? [];
  const isLoading = acceptedQuery.isLoading || pendingQuery.isLoading;

  return { acceptedQuery, pendingQuery, accepted, pending, isLoading };
}

/* =========================
   Hooks: mutations
========================= */

function useMembersMutations(groupId: string) {
  const qc = useQueryClient();

  const changeRoleMut = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: "admin" | "member";
    }) => changeGroupMemberRole(memberId, role),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });

  const changeStatusMut = useMutation({
    mutationFn: ({
      memberId,
      status,
    }: {
      memberId: string;
      status: MemberStatus;
    }) => changeGroupMemberStatus(memberId, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });

  // У вас "удаление" = banned
  const removeMut = useMutation({
    mutationFn: (memberId: string) =>
      changeGroupMemberStatus(memberId, "banned"),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });

  const isBusy =
    changeRoleMut.isPending || changeStatusMut.isPending || removeMut.isPending;

  return { changeRoleMut, changeStatusMut, removeMut, isBusy };
}

/* =========================
   UI: small pieces
========================= */

function EmptyState({ children }: { children: string }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
}

function MemberRow({
  member,
  canChangeRole,
  canKick,
  onRequestRoleChange,
  onRequestRemove,
  disabled,
}: {
  member: GroupMember;
  canChangeRole: boolean;
  canKick: boolean;
  onRequestRoleChange: (nextRole: "admin" | "member") => void;
  onRequestRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        imageUrl={member.user.avatarUrl ?? undefined}
        name={member.user.name}
        className="w-12 h-12"
      />

      <div className="flex min-w-0 flex-col">
        <div className="text-sm font-medium truncate">{member.user.name}</div>

        {member.role === "owner" ? (
          <div className="text-xs text-muted-foreground">owner</div>
        ) : (
          <Select
            value={(member.role ?? "member") as "admin" | "member"}
            onValueChange={(v) => {
              if (v === member.role) return;
              onRequestRoleChange(v as "admin" | "member");
            }}
            disabled={!canChangeRole || disabled}
          >
            <SelectTrigger className="h-7 w-28 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="member">member</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {canKick && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRequestRemove}
            disabled={disabled}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

function RequestRow({
  member,
  canManageRequests,
  onAccept,
  onReject,
  disabled,
}: {
  member: GroupMember;
  canManageRequests: boolean;
  onAccept: () => void;
  onReject: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        imageUrl={member.user.avatarUrl ?? undefined}
        name={member.user.name}
        className="w-12 h-12"
      />

      <div className="flex min-w-0 flex-col">
        <div className="text-sm font-medium truncate">{member.user.name}</div>
        <div className="text-xs text-muted-foreground">pending</div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {canManageRequests && (
          <>
            <Button size="sm" onClick={onAccept} disabled={disabled}>
              Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onReject}
              disabled={disabled}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmActionDialog({
  open,
  pending,
  isBusy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  pending: PendingAction;
  isBusy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const title = pending?.type === "remove" ? "Remove member?" : "Change role?";

  const description =
    pending?.type === "remove"
      ? `Are you sure you want to remove ${pending.memberName} from the group?`
      : pending?.type === "changeRole"
        ? `Change role for ${pending.memberName} to ${pending.nextRole}?`
        : "";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isBusy}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction disabled={isBusy || !pending} onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* =========================
   Main component
========================= */

export const MembersList = ({ groupId, myRole, myUserId }: Props) => {
  const [open, setOpen] = useState(false);

  // confirm state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);

  const {
    accepted,
    pending: pendingMembers,
    isLoading,
  } = useMembersQueries(groupId, open);

  const { canManageRequests, canChangeRole, canKick } = useMemberPermissions(
    myRole,
    myUserId,
  );

  const { changeRoleMut, changeStatusMut, removeMut, isBusy } =
    useMembersMutations(groupId);

  const openConfirm = (action: Exclude<PendingAction, null>) => {
    setPending(action);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPending(null);
  };

  const handleConfirm = () => {
    if (!pending) return;

    if (pending.type === "remove") {
      removeMut.mutate(pending.memberId, { onSettled: closeConfirm });
      return;
    }

    if (pending.type === "changeRole") {
      changeRoleMut.mutate(
        { memberId: pending.memberId, role: pending.nextRole },
        { onSettled: closeConfirm },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-2">
          Show Members
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogTitle>Group Members</DialogTitle>

        <Tabs defaultValue="members" className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="members" className="flex-1">
              Все участники ({accepted.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Заявки ({pendingMembers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <ScrollArea className="h-96 mt-4">
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <EmptyState>Loading…</EmptyState>
                ) : accepted.length === 0 ? (
                  <EmptyState>Нет участников</EmptyState>
                ) : (
                  accepted.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      canChangeRole={canChangeRole(member)}
                      canKick={canKick(member)}
                      disabled={isBusy}
                      onRequestRoleChange={(nextRole) =>
                        openConfirm({
                          type: "changeRole",
                          memberId: member.id,
                          memberName: member.user.name,
                          nextRole,
                        })
                      }
                      onRequestRemove={() =>
                        openConfirm({
                          type: "remove",
                          memberId: member.id,
                          memberName: member.user.name,
                        })
                      }
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests">
            <ScrollArea className="h-96 mt-4">
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <EmptyState>Loading…</EmptyState>
                ) : pendingMembers.length === 0 ? (
                  <EmptyState>Нет заявок</EmptyState>
                ) : (
                  pendingMembers.map((member) => (
                    <RequestRow
                      key={member.id}
                      member={member}
                      canManageRequests={canManageRequests}
                      disabled={isBusy}
                      onAccept={() =>
                        changeStatusMut.mutate({
                          memberId: member.id,
                          status: "accepted",
                        })
                      }
                      onReject={() =>
                        changeStatusMut.mutate({
                          memberId: member.id,
                          status: "banned",
                        })
                      }
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <ConfirmActionDialog
          open={confirmOpen}
          pending={pending}
          isBusy={isBusy}
          onCancel={closeConfirm}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
};
