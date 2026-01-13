<?php

namespace App\Modules\Feed\Domain\Repository;

use App\Modules\Feed\Domain\Entity\Wall;
use Symfony\Component\Uid\Uuid;

interface WallRepositoryInterface
{
    public function getWallById(Uuid $wallId): ?Wall;
    public function save(Wall $wall, bool $flush = true): void;
}
