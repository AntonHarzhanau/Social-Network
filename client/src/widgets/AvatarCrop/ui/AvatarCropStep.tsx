import Cropper from "react-easy-crop";
import { Button } from "@/shared/components/ui/button";
import { Slider } from "@/shared/components/ui/slider";
import type { CropRect } from "../model/useImageCrop";

export function AvatarCropStep(props: {
  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  previewUrl: string | null;
  saving: boolean;

  onCropChange: (v: { x: number; y: number }) => void;
  onZoomChange: (v: number) => void;
  onCropComplete: (_: any, croppedAreaPixels: CropRect) => void;

  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex-1 min-h-0 mt-3 flex flex-col lg:flex-row gap-3 lg:gap-4">
      <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-black">
        <Cropper
          image={props.imageSrc}
          crop={props.crop}
          zoom={props.zoom}
          aspect={1}
          onCropChange={props.onCropChange}
          onZoomChange={props.onZoomChange}
          onCropComplete={props.onCropComplete}
          cropShape="rect"
          showGrid
        />
      </div>

      <div className="lg:w-[360px] shrink-0 flex flex-col min-h-0 gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium mb-2">Preview</div>
            <div className="flex items-center justify-center">
              <div
                className="
                  rounded-full overflow-hidden border
                  h-[clamp(72px,18vw,180px)]
                  w-[clamp(72px,18vw,180px)]
                  lg:h-[220px] lg:w-[220px]
                "
              >
                {props.previewUrl ? (
                  <img
                    src={props.previewUrl}
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
          <Button onClick={props.onSave} disabled={props.saving}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
