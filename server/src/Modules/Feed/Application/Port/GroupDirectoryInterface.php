<?php

namespace App\Modules\Feed\Application\Port;

use Symfony\Component\Uid\Uuid;



interface GroupDirectoryInterface
{
    /** @return array<string, GroupPreviewDTO | null> */
    public function findPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array;

}
