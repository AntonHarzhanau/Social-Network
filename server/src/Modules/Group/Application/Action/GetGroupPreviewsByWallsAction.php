<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Api\DTO\GroupPreviewDTO;
use App\Modules\Group\Application\DTO\GroupPreviewRawDTO;
use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class GetGroupPreviewsByWallsAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {}

    public function execute(Uuid $currentUserId, array $wallIds): array
    {
        $groups = $this->groupRepository->findGroupsByWallIds($currentUserId, $wallIds);

        $mediaIds = array_map(
            fn(GroupPreviewRawDTO $group) => $group->avatarId,
            array_filter($groups, fn(GroupPreviewRawDTO $group) => $group->avatarId !== null)
        );

        $mediaIds = array_unique($mediaIds);
        $medias = $this->mediaDirectory->getMediaItemsByIds($mediaIds);
        $result = [];
        foreach ($groups as $group) {
            $result[] = new GroupPreviewDTO(
                id: $group->id,
                name: $group->name,
                wallId: $group->wallId,
                isMember: $group->isMember,
                role: $group->role->value ?? null,
                subscribersCount: $group->subscribersCount,
                avatarUrl: $group->avatarId ? ($medias[$group->avatarId]->url ?? null) : null,
            );
        }
        
        return $result;
    }
}
