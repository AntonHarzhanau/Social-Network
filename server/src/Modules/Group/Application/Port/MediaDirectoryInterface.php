<?php

namespace App\Modules\Group\Application\Port;

use Symfony\Component\Uid\Uuid;

interface MediaDirectoryInterface
{
    public function getMediaItemsByIds(array $ids): array;

    public function getMediaById(Uuid $id);
}
