import React, { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { readFileAsDataURL, getCroppedBlob } from "@/shared/lib/image/crop";
import { Slider } from "@/shared/components/ui/slider";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  // Вызывается, когда пользователь нажал Save
  onSaved: (data: {
    original: File;
    preview: File;
    previewUrl: string;
  }) => void;
};

export function AvatarCropDialog({ open, onOpenChange, onSaved }: Props) {
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

  // cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canCrop = Boolean(imageSrc);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // базовая валидация
    if (!file.type.startsWith("image/")) return;

    // reset preview object url
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    setOriginalFile(file);
    const src = await readFileAsDataURL(file);
    setImageSrc(src);

    // сброс настроек
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedPixels(croppedAreaPixels);
  };

  // Live preview: перерисовываем превью при изменении crop/zoom (debounce ~100ms)
  useEffect(() => {
    if (!imageSrc || !croppedPixels) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const blob = await getCroppedBlob(
          imageSrc,
          croppedPixels,
          256,
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
        // игнорируем в live-preview
      }
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [imageSrc, croppedPixels, zoom, crop]);

  const handleCancel = () => {
    // сбрасываем всё и закрываем
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOriginalFile(null);
    setImageSrc(null);
    setCroppedPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!originalFile || !imageSrc || !croppedPixels) return;

    setSaving(true);
    try {
      const previewBlob = await getCroppedBlob(
        imageSrc,
        croppedPixels,
        512,
        "image/jpeg",
        0.92,
      );
      const previewFile = new File([previewBlob], "avatar_preview.jpg", {
        type: "image/jpeg",
      });

      const url = URL.createObjectURL(previewBlob);

      onSaved({
        original: originalFile,
        preview: previewFile,
        previewUrl: url, // для немедленного отображения на клиенте
      });

      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update avatar</DialogTitle>
          <DialogDescription>
            Choose an image, move the square area, and save.
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
          <div className="flex items-center justify-between gap-3">
            <Button onClick={handlePick}>Choose photo</Button>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
            {/* Left: crop area */}
            <div className="relative w-full h-[420px] rounded-xl overflow-hidden bg-black">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                // Квадратная область (как ты хочешь)
                cropShape="rect"
                showGrid={true}
              />
            </div>

            {/* Right: preview + controls */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border p-3">
                <div className="text-sm font-medium mb-2">Preview</div>
                <div className="flex items-center justify-center">
                  <div className="h-40 w-40 rounded-full overflow-hidden border">
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
              </div>

              <div className="rounded-xl border p-3">
                <div className="text-sm font-medium mb-2">Zoom</div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.05}
                  onValueChange={(v) => setZoom(v[0] ?? 1)}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
