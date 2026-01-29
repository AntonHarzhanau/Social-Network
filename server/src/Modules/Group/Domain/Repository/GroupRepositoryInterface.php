<?php

namespace App\Modules\Group\Domain\Repository;

use App\Modules\Group\Application\DTO\GroupDetailsRawDTO;
use App\Modules\Group\Domain\Entity\Group;
use Symfony\Component\Uid\Uuid;

interface GroupRepositoryInterface
{
    public function save(Group $entity, bool $flush = true): void;

    public function delete(Group $entity, bool $flush = true): void;

    public function findById(Uuid $groupId): ?Group;

    /** @return array<string> wallIds */
    public function findWallIdsByUserId(Uuid $userId): array;

    public function findGroupsByWallIds(Uuid $currentUserId, array $wallIds): array;

    public function findAcceptedMemberGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array;
    public function findAllGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array;
    public function findOwnedGroups(Uuid $currentUserId, ?string $q = null, int $page = 1, int $limit = 10): array;

}
