<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Group\Api\GroupApiInterface;
use Symfony\Component\Uid\Uuid;


class GroupDirectoryAdapter implements GroupDirectoryInterface
{
    public function __construct(
        private readonly GroupApiInterface $groupApi,
    ) {}
   
    public function findPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array
    {
        $groups = $this->groupApi->getGroupsPreviewsByWallIds($currentUserId, $wallIds);
        foreach ($groups as $group) {
            $groups[$group->wallId] = $group;
        }

        return $groups;
    }
}
