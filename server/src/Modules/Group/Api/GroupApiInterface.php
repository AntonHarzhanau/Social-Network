<?php

namespace App\Modules\Group\Api;

use Symfony\Component\Uid\Uuid;


interface GroupApiInterface
{
    public function findGroupWallIdsByUserId(Uuid $userId): array;

    public function getGroupsPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array;

    public function getUserRole(Uuid $groupId, Uuid $userId): ?string;
}
