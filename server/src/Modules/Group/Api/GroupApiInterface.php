<?php

namespace App\Modules\Group\Api;

use Symfony\Component\Uid\Uuid;

interface GroupApiInterface
{
    /** @return GroupPreviewDTO[] */
    public function getGroupsPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array;
}
