<?php

namespace App\Modules\Group\Domain\Repository;

use App\Modules\Group\Domain\Entity\Group;
use Symfony\Component\Uid\Uuid;

interface GroupRepositoryInterface
{
    public function save(Group $entity, bool $flush = true): void;

    public function delete(Group $entity, bool $flush = true): void;

    public function findAllGroups(int $page, $limit): array;

    public function findById(Uuid $id): ?Group;

    /** @return array<string> wallIds */
    public function findWallIdsByGroupIds(array $groupIds): array;
    
    public function findGroupsByWallIds(array $wallIds): array;
}
