import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Slider } from "@/shared/components/ui/slider";
import { getCroppedBlob, readFileAsDataURL } from "@/shared/lib/image/crop";

interface CoverCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (data: {
    original: File;
    preview: File;
    previewUrl: string;
  }) => void;
}

const COVER_ASPECT = 16 / 9;
const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH / COVER_ASPECT);
const OUTPUT_WIDTH = 1920;
const OUTPUT_HEIGHT = Math.round(OUTPUT_WIDTH / COVER_ASPECT);

export function CoverCropDialog({
  open,
  onOpenChange,
  onSaved,
}: CoverCropDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetState = () => {
    setPreviewUrl(null);
    setOriginalFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
  };

  const handlePick = () => inputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    setOriginalFile(file);
    const src = await readFileAsDataURL(file);
    setImageSrc(src);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedPixels(croppedAreaPixels);
  };

  useEffect(() => {
    if (!imageSrc || !croppedPixels) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const blob = await getCroppedBlob(
          imageSrc,
          croppedPixels,
          PREVIEW_WIDTH,
          PREVIEW_HEIGHT,
          "image/jpeg",
          0.9,
        );
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
      } catch {
        /* ignore preview errors */
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [imageSrc, croppedPixels, zoom, crop]);

  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!originalFile || !imageSrc || !croppedPixels) return;
    setSaving(true);
    try {
      const previewBlob = await getCroppedBlob(
        imageSrc,
        croppedPixels,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT,
        "image/jpeg",
        0.92,
      );
      const previewFile = new File([previewBlob], "cover_preview.jpg", {
        type: "image/jpeg",
      });
      const url = URL.createObjectURL(previewBlob);
      onSaved({
        original: originalFile,
        preview: previewFile,
        previewUrl: url,
      });
      resetState();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const canCrop = Boolean(imageSrc);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetState();
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="
          w-screen h-dvh max-w-none rounded-none
          overflow-hidden
          p-3 sm:p-6
          sm:w-full sm:max-w-5xl sm:h-[92dvh] sm:rounded-xl
        "
      >
        <div className="flex flex-col h-full min-h-0">
          <DialogHeader className="shrink-0">
            <DialogTitle>Update cover</DialogTitle>
            <DialogDescription className="hidden sm:block">
              Choose a photo, adjust the crop for best fit, and save the new
              cover.
            </DialogDescription>
          </DialogHeader>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!canCrop ? (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Button onClick={handlePick}>Choose photo</Button>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="flex-1 min-h-0 mt-3 flex flex-col lg:flex-row gap-3 lg:gap-4">
              <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-black">
                <Cropper
                  image={imageSrc!}
                  crop={crop}
                  zoom={zoom}
                  aspect={COVER_ASPECT}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid
                />
              </div>

              <div className="lg:w-[360px] shrink-0 flex flex-col min-h-0 gap-3">
                <div className="rounded-xl border p-3">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="rounded-lg border overflow-hidden aspect-video bg-muted">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-sm font-medium mb-2">Zoom</div>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.05}
                    onValueChange={(value) => setZoom(value[0] ?? 1)}
                  />
                </div>

                <div className="mt-auto flex items-center justify-end gap-2">
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
