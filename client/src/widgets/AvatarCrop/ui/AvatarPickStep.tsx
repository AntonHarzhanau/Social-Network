import { Button } from "@/shared/components/ui/button";

export function AvatarPickStep(props: {
  onPick: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm text-muted-foreground">
        Choose a photo to crop for your avatar.
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button onClick={props.onPick}>Choose photo</Button>
      </div>
    </div>
  );
}
