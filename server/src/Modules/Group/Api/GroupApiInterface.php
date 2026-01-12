<?php

namespace App\Modules\Group\Api;

interface GroupApiInterface
{
    /** @return GroupPreviewDTO[] */
    public function getGroupsPreviewsByWallIds(array $wallIds): array;
}
