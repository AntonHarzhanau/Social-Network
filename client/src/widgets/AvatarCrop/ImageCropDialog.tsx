import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cropPresets, type CropVariant } from "./model/cropPresets";
import { useImageCrop } from "./model/useImageCrop";
import { ImagePickStep } from "./ui/ImagePickStep";
import { ImageCropStep } from "./ui/ImageCropStep";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  variant?: CropVariant; // <-- "avatar" | "cover"
  onSaved: (data: {
    original: File;
    preview: File;
    previewUrl: string;
  }) => void;
};

export function ImageCropDialog({
  open,
  onOpenChange,
  onSaved,
  variant = "avatar",
}: Props) {
  const preset = cropPresets[variant];
  const crop = useImageCrop({ preset, onSaved });

  useEffect(() => {
    if (!open) crop.reset();
  }, [open]);

  const handleOpenChange = (v: boolean) => {
    if (!v) crop.reset();
    onOpenChange(v);
  };

  const contentClass =
    crop.step === "pick"
      ? `
        w-[92vw] max-w-[420px]
        rounded-xl
        p-6
      `
      : `
        w-screen h-dvh max-w-none rounded-none
        overflow-hidden
        p-3 sm:p-6
        sm:w-full sm:max-w-5xl sm:h-[92dvh] sm:rounded-xl
      `;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent aria-describedby={preset.title} className={contentClass}>
        <div
          className={crop.step === "pick" ? "" : "flex flex-col h-full min-h-0"}
        >
          <DialogHeader className={crop.step === "pick" ? "" : "shrink-0"}>
            <DialogTitle>{preset.title}</DialogTitle>
            <DialogDescription
              className={crop.step === "pick" ? "" : "hidden sm:block"}
            >
              {preset.description}
            </DialogDescription>
          </DialogHeader>

          <input
            ref={crop.inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={crop.onFileChange}
          />

          {crop.step === "pick" ? (
            <ImagePickStep
              onPick={crop.pick}
              onClose={() => handleOpenChange(false)}
            />
          ) : (
            <ImageCropStep
              variant={variant}
              aspect={preset.aspect}
              imageSrc={crop.imageSrc!}
              crop={crop.crop}
              zoom={crop.zoom}
              livePreviewUrl={crop.livePreviewUrl}
              saving={crop.saving}
              canSave={crop.canSave}
              onCropChange={crop.setCrop}
              onZoomChange={crop.setZoom}
              onCropComplete={crop.onCropComplete}
              onCancel={() => handleOpenChange(false)}
              onSave={async () => {
                await crop.save();
                handleOpenChange(false);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
