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

import type { PendingRoleChange } from "../model/types";
import { roleLabel } from "@/entities/chat/lib/role";

export function RoleChangeConfirmDialog(props: {
  pending: PendingRoleChange | null;
  confirming: boolean;
  onClose: () => void;
  onConfirm: (p: PendingRoleChange) => Promise<void> | void;
}) {
  return (
    <AlertDialog
      open={props.pending !== null}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change role</AlertDialogTitle>
          <AlertDialogDescription>
            {props.pending && (
              <>
                Change role for <b>{props.pending.userName}</b> from{" "}
                <b>{roleLabel(props.pending.from)}</b> to{" "}
                <b>{roleLabel(props.pending.to)}</b>?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={props.confirming}
            onClick={props.onClose}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={!props.pending || props.confirming}
            onClick={() => props.pending && props.onConfirm(props.pending)}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
