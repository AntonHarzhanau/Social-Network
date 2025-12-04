export const UPLOADING_STATUS = {
    UPLOADING: "uploading",
    SUCCESS: "success",
    ERROR: "error",
} as const;

export type UPLOADING_STATUS = typeof UPLOADING_STATUS[keyof typeof UPLOADING_STATUS];

export type MediaItem = {
  localId: string;
  file: File;
  status: UPLOADING_STATUS;
  serverId?: string;
  previewUrl?: string;
  error?: string;
};

