export type CropVariant = "avatar" | "cover";

export type CropPreset = {
  variant: CropVariant;
  title: string;
  description?: string;

  aspect: number;

  previewW: number;
  previewH: number;

  outputW: number;
  outputH: number;

  mime: "image/jpeg" | "image/png";
  previewQuality: number;
  outputQuality: number;

  outputFileName: string;
};

const COVER_ASPECT = 16 / 9;

export const cropPresets: Record<CropVariant, CropPreset> = {
  avatar: {
    variant: "avatar",
    title: "Update avatar",
    description: "Choose an image, move the square area, and save.",
    aspect: 1,

    previewW: 256,
    previewH: 256,

    outputW: 512,
    outputH: 512,

    mime: "image/jpeg",
    previewQuality: 0.9,
    outputQuality: 0.92,

    outputFileName: "avatar_preview.jpg",
  },

  cover: {
    variant: "cover",
    title: "Update cover",
    description: "Choose a photo, adjust the crop for best fit, and save.",
    aspect: COVER_ASPECT,

    previewW: 1280,
    previewH: Math.round(1280 / COVER_ASPECT),

    outputW: 1920,
    outputH: Math.round(1920 / COVER_ASPECT),

    mime: "image/jpeg",
    previewQuality: 0.9,
    outputQuality: 0.92,

    outputFileName: "cover_preview.jpg",
  },
};
