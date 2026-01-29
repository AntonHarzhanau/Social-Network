<?php

namespace App\Modules\Group\Application\Service;

use App\Modules\Group\Application\DTO\GroupDetailResponseDTO;
use App\Modules\Group\Application\DTO\GroupDetailsRawDTO;
use App\Modules\Group\Application\DTO\GroupPreviewRawDTO;
use App\Modules\Group\Application\DTO\GroupPreviewResponseDTO;
use App\Modules\Group\Application\Port\MediaDirectoryInterface;

final class GroupResponseFactory
{
    public function __construct(
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {
    }

    public function toListResponse(array $groupRawDTOs): array
    {
        $mediaIds = array_map(
            fn(GroupPreviewRawDTO $dto) => $dto->avatarId,
            array_filter($groupRawDTOs, fn(GroupPreviewRawDTO $dto) => $dto->avatarId !== null)
        );
        $mediaIds = array_values(array_unique($mediaIds));
        $medias = $this->mediaDirectory->getMediaItemsByIds($mediaIds);

        $result = [];
        foreach ($groupRawDTOs as $groupRawDTO) {
            $avatarId = $groupRawDTO->avatarId;
            $result[] = new GroupPreviewResponseDTO(
                id: $groupRawDTO->id,
                name: $groupRawDTO->name,
                isMember: $groupRawDTO->isMember,
                role: $groupRawDTO->role?->value,
                status: $groupRawDTO->status?->value,
                subscribersCount: $groupRawDTO->subscribersCount,
                currentAvatar: $avatarId ? $medias[$avatarId] ?? null : null,
            );
        }
        return $result;
    }
}
