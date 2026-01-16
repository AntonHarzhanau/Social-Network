<?php

namespace App\Modules\Group\Application\Service;

use App\Modules\Group\Application\DTO\GroupRawDTO;
use App\Modules\Group\Application\DTO\GroupResponseDTO;
use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Infrastructure\Adapter\MediaDirectoryAdapter;

final class GroupResponseFactory
{
    public function __construct(
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {}

    public function toListResponse(array $groupRawDTOs): array
    {
        $mediaIds = array_map(
            fn(GroupRawDTO $dto) => $dto->currentAvatarId,
            array_filter($groupRawDTOs, fn(GroupRawDTO $dto) => $dto->currentAvatarId !== null)
        );
        $mediaIds = array_values(array_unique($mediaIds));
        $medias = $this->mediaDirectory->getMediaItemsByIds($mediaIds);

        $result = [];
        foreach ($groupRawDTOs as $groupRawDTO) {
            $currentAvatarId = $groupRawDTO->currentAvatarId;
            $result[] = new GroupResponseDTO(
                id: $groupRawDTO->id,
                name: $groupRawDTO->name,
                isMember: $groupRawDTO->isMember,
                subscribersCount: $groupRawDTO->subscribersCount,
                wallId: $groupRawDTO->wallId,
                currentAvatar: $currentAvatarId ? $medias[$currentAvatarId] ?? null : null,
            );
        }
        return $result;
    }
}
