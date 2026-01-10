import { useMediaViewerStore } from "@/features/media/viewer/useMediaViewerStore"
import { MediaModal } from "./MediaModal"

const GlobalMediaViewer = () => {
    const isOpen = useMediaViewerStore((s) => s.isOpen);
    const payload = useMediaViewerStore((s) => s.payload)
    const isActiveIndex = useMediaViewerStore((s) => s.activeIndex);
    const closeViewer = useMediaViewerStore((s) => s.closeViewer);

    const closeViewew = useMediaViewerStore((s) => s.closeViewer);

    if (!payload) return null;

    return (
    <MediaModal
        open={isOpen}
        onOpenChange={(v) => (v ? null : closeViewew())}
        author={payload.author}
        medias={payload.medias}
        initialIndex={isActiveIndex}
    />
  )
}

export default GlobalMediaViewer
