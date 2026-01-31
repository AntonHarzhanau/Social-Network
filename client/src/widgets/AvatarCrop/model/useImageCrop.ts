import { useEffect, useRef, useState } from "react";
import { getCroppedBlob, readFileAsDataURL } from "@/shared/lib/image/crop";
import type { CropPreset } from "./cropPresets";

export type CropRect = { x: number; y: number; width: number; height: number };

export type CropSaved = {
  original: File;
  preview: File;
  previewUrl: string;
};

export function useImageCrop(params: {
  preset: CropPreset;
  onSaved: (data: CropSaved) => void;
}) {
  const { preset } = params;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedPixels, setCroppedPixels] = useState<CropRect | null>(null);

  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const step: "pick" | "crop" = imageSrc ? "crop" : "pick";
  const canCrop = Boolean(imageSrc);
  const canSave = Boolean(originalFile && imageSrc && croppedPixels) && !saving;

  const pick = () => inputRef.current?.click();

  const reset = () => {
    setOriginalFile(null);
    setImageSrc(null);
    setCroppedPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });

    setLivePreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });

    if (inputRef.current) inputRef.current.value = "";
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setLivePreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });

    setOriginalFile(file);
    const src = await readFileAsDataURL(file);
    setImageSrc(src);

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedPixels(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  const onCropComplete = (_: any, croppedAreaPixels: CropRect) => {
    setCroppedPixels(croppedAreaPixels);
  };

  useEffect(() => {
    if (!imageSrc || !croppedPixels) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const blob = await getCroppedBlob(
          imageSrc,
          croppedPixels,
          preset.previewW,
          preset.previewH,
          preset.mime,
          preset.previewQuality,
        );
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        setLivePreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
      } catch {}
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [imageSrc, croppedPixels, zoom, crop, preset]);

  useEffect(() => {
    return () => {
      if (livePreviewUrl) URL.revokeObjectURL(livePreviewUrl);
    };
  }, [livePreviewUrl]);

  const save = async () => {
    if (!originalFile || !imageSrc || !croppedPixels) return;

    setSaving(true);
    try {
      const outBlob = await getCroppedBlob(
        imageSrc,
        croppedPixels,
        preset.outputW,
        preset.outputH,
        preset.mime,
        preset.outputQuality,
      );

      const outFile = new File([outBlob], preset.outputFileName, {
        type: preset.mime,
      });

      const outUrl = URL.createObjectURL(outBlob);

      params.onSaved({
        original: originalFile,
        preview: outFile,
        previewUrl: outUrl,
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    inputRef,
    step,
    canCrop,
    canSave,
    saving,

    imageSrc,
    crop,
    zoom,
    livePreviewUrl,

    pick,
    reset,
    onFileChange,

    setCrop,
    setZoom,
    onCropComplete,

    save,
  };
}
