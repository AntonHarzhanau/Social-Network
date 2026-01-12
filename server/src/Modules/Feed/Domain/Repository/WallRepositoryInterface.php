<?php

namespace App\Modules\Feed\Domain\Repository;

interface WallRepositoryInterface
{
    public function getWallById(string $id);
}
