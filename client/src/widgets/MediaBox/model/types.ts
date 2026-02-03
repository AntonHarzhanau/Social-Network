import type { MediaPreview } from "@/entities/media/model/types";
import type { MediaKind, MediaOwnerKind } from "./keys";

export type MediaBoxOwner = {
  kind: MediaOwnerKind;
  id: string;
};

export interface MediaBoxSource {
  owner: MediaBoxOwner;
  canView: boolean;
  canUpload: boolean;

  fetchMedias: (
    type: MediaKind,
    signal?: AbortSignal,
  ) => Promise<MediaPreview[]>;

  attachMedias?: (mediaIds: string[]) => Promise<unknown>;

  afterAttachInvalidate?: (
    qc: import("@tanstack/react-query").QueryClient,
  ) => void;

  onShowAll?: (type: MediaKind) => void;

  onOpenViewer?: (params: {
    type: MediaKind;
    medias: MediaPreview[];
    initialIndex: number;
  }) => void;
}
