import Cropper from "react-easy-crop";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import type { CropRect } from "../model/useImageCrop";
import type { CropVariant } from "../model/cropPresets";

export function ImageCropStep(props: {
  variant: CropVariant;
  aspect: number;

  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  livePreviewUrl: string | null;

  saving: boolean;
  canSave: boolean;

  onCropChange: (v: { x: number; y: number }) => void;
  onZoomChange: (v: number) => void;
  onCropComplete: (_: any, croppedAreaPixels: CropRect) => void;

  onCancel: () => void;
  onSave: () => void;
}) {
  const isAvatar = props.variant === "avatar";
  const cropBoxClass = isAvatar
    ? "aspect-square min-h-[260px] sm:min-h-[320px]"
    : "aspect-video min-h-[220px] sm:min-h-[280px]";

  return (
    <div className="flex-1 min-h-0 mt-3 flex flex-col md:flex-row gap-3 md:gap-4">
      {/* Cropper box */}
      <div
        className={[
          "relative w-full rounded-xl overflow-hidden bg-black",
          cropBoxClass,
          "md:aspect-auto md:flex-1 md:min-h-0",
        ].join(" ")}
      >
        <Cropper
          image={props.imageSrc}
          crop={props.crop}
          zoom={props.zoom}
          aspect={props.aspect}
          onCropChange={props.onCropChange}
          onZoomChange={props.onZoomChange}
          onCropComplete={props.onCropComplete}
          cropShape="rect"
          showGrid
        />
      </div>

      {/* Side panel */}
      <div className="md:w-[360px] shrink-0 flex flex-col min-h-0 gap-3">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium mb-2">Preview</div>

            {isAvatar ? (
              <div className="flex items-center justify-center">
                <div className="rounded-full overflow-hidden border h-24 w-24 sm:h-32 sm:w-32 md:h-[220px] md:w-[220px]">
                  {props.livePreviewUrl ? (
                    <img
                      src={props.livePreviewUrl}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden aspect-video bg-muted">
                {props.livePreviewUrl ? (
                  <img
                    src={props.livePreviewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium mb-2">Zoom</div>
            <Slider
              value={[props.zoom]}
              min={1}
              max={3}
              step={0.05}
              onValueChange={(v) => props.onZoomChange(v[0] ?? 1)}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            onClick={props.onCancel}
            disabled={props.saving}
          >
            Cancel
          </Button>
          <Button onClick={props.onSave} disabled={!props.canSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
