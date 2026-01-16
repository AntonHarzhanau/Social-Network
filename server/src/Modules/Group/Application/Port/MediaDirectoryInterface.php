<?php

namespace App\Modules\Group\Application\Port;

interface MediaDirectoryInterface
{
    public function getMediaItemsByIds(array $ids): array;
}
