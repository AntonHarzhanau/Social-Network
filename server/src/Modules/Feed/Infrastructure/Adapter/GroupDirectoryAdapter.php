<?php

namespace App\Modules\Feed\Infrastructure\Adapter;

use App\Modules\Feed\Application\Port\GroupDirectoryInterface;
use App\Modules\Group\Api\GroupApiInterface;
use App\Modules\Media\Api\MediaApiInterface;


class GroupDirectoryAdapter implements GroupDirectoryInterface
{
    public function __construct(
        private readonly GroupApiInterface $groupApi,
    ) {}
   
    public function findPreviewsByWallIds(array $wallIds): array
    {
        $groups = $this->groupApi->getGroupsPreviewsByWallIds($wallIds);
        foreach ($groups as $group) {
            $groups[$group->wallId] = $group;
        }

        return $groups;
    }
}
