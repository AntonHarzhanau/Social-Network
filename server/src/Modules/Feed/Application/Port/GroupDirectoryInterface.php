<?php

namespace App\Modules\Feed\Application\Port;



interface GroupDirectoryInterface
{
    /** @return array<string, GroupPreviewDTO | null> */
    public function findPreviewsByWallIds(array $wallIds): array;

}
