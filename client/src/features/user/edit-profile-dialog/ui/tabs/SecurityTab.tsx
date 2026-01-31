import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function SecurityTab(props?: {
  onSave?: (data: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave =
    oldPassword.trim() &&
    newPassword.trim() &&
    confirmNewPassword.trim() &&
    newPassword === confirmNewPassword;

  return (
    <div className="grid gap-4 overflow-auto pr-2">
      <div className="grid gap-2">
        <Label>Old password</Label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>New password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Confirm new password</Label>
        <Input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        {confirmNewPassword && newPassword !== confirmNewPassword && (
          <div className="text-xs text-destructive">Passwords do not match</div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
          }}
        >
          Clear
        </Button>

        <Button
          disabled={!canSave || saving}
          onClick={async () => {
            if (!props?.onSave) return;
            setSaving(true);
            try {
              await props.onSave({
                oldPassword,
                newPassword,
                confirmNewPassword,
              });
              setOldPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            } finally {
              setSaving(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
