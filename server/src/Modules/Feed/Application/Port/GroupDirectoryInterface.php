<?php

namespace App\Modules\Feed\Application\Port;

use Symfony\Component\Uid\Uuid;



interface GroupDirectoryInterface
{
    public function findGroupWallIdsByUserId(Uuid $userId): array;

    /** @return array<string, GroupPreviewDTO | null> */
    public function findPreviewsByWallIds(Uuid $currentUserId, array $wallIds): array;

    public function getUserRole(Uuid $groupId, Uuid $userId): ?string;

}
