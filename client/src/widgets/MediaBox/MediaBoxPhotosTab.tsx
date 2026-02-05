import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";

import type { MediaBoxSource } from "./model/types";
import { mediaBoxKeys } from "./model/keys";
import { UploadOwnerMediaDialog } from "@/features/media/upload-media/ui/UploadOwnerMediaDialog";
import { MediaBoxShowAllDialog } from "./MediaBoxShowAllDialog";

export const MediaBoxPhotosTab = ({
  source,
  labelUpload = "Load photos",
  labelAll = "All photos",
}: {
  source: MediaBoxSource;
  labelUpload?: string;
  labelAll?: string;
}) => {
  const [showAllOpen, setShowAllOpen] = useState(false);

  const q = useQuery({
    queryKey: mediaBoxKeys.list(source.owner, "image"),
    queryFn: ({ signal }) => source.fetchMedias("image", signal),
    enabled: source.canView,
    staleTime: 60_000,
  });

  if (q.isPending) return <Skeleton className="min-h-64 w-full" />;
  if (q.isError) return null;

  const medias = (q.data ?? []).slice(0, 6);

  const onOpen = (idx: number) => {
    if (!source.onOpenViewer) return;
    source.onOpenViewer({
      type: "image",
      medias: q.data ?? [],
      initialIndex: idx,
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="p-2">
          <div className="flex flex-wrap gap-1 rounded-2xl overflow-hidden">
            {medias.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpen(idx)}
                className="relative aspect-square w-[calc(33.333%-0.34rem)] overflow-hidden"
              >
                <img
                  src={m.url}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* bottom actions */}
        <div className="mt-auto flex gap-4 w-full px-2 pb-2">
          {source.canUpload && source.attachMedias ? (
            <UploadOwnerMediaDialog
              label={labelUpload}
              accept="image"
              multiple={true}
              owner={source.owner}
              attachMedias={source.attachMedias}
              afterAttachInvalidate={source.afterAttachInvalidate}
            />
          ) : null}

          <Button className="flex-1" onClick={() => setShowAllOpen(true)}>
            {labelAll}
          </Button>
        </div>
      </div>

      <MediaBoxShowAllDialog
        open={showAllOpen}
        onOpenChange={setShowAllOpen}
        source={source}
        type="image"
        title={labelAll}
      />
    </>
  );
};
