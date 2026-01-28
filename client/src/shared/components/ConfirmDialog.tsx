import { cn } from "@/shared/lib/utils";
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
import type { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: ReactNode;
  description?: ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  destructive?: boolean;

  contentClassName?: string;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading,
  disabled,
  destructive,
  contentClassName,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(contentClassName)}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={disabled || isLoading}
            onClick={async (e) => {
              e.stopPropagation();
              if (disabled || isLoading) return;

              try {
                await onConfirm();
                onOpenChange(false);
              } catch {}
            }}
            className={cn(
              destructive &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            )}
          >
            {isLoading ? "Please wait..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
