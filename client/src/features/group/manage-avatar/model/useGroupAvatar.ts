import { useQueryClient } from "@tanstack/react-query";
import { uploadMedia } from "@/entities/media/api/mediaApi";
import { setGroupAvatar } from "@/entities/group/api/groupApi";
import { groupKeys } from "@/entities/group/model/queryKeys";
import {
  patchGroupDetail,
  patchGroupLists,
} from "@/entities/group/model/cache";
import type { MediaPreview } from "@/entities/media/model/types";

export function useGroupAvatar(groupId?: string | null) {
  const qc = useQueryClient();

  const sync = async () => {
    if (!groupId) return;
    await Promise.all([
      qc.invalidateQueries({ queryKey: groupKeys.detail(groupId) }),
      qc.invalidateQueries({ queryKey: groupKeys.lists() }),
    ]);
  };

  async function uploadNewAvatar(_original: File, preview: File) {
    if (!groupId) return;

    const previewRes = (await uploadMedia(preview)) as MediaPreview;

    patchGroupDetail(qc, groupId, { currentAvatar: previewRes });
    patchGroupLists(qc, groupId, { currentAvatar: previewRes });

    await setGroupAvatar(groupId, previewRes.id);

    await sync();
    return previewRes;
  }

  async function deleteAvatar() {
    if (!groupId) return;

    patchGroupDetail(qc, groupId, { currentAvatar: null });
    patchGroupLists(qc, groupId, { currentAvatar: null });

    await setGroupAvatar(groupId, null);
    await sync();
  }

  return { uploadNewAvatar, deleteAvatar };
}
