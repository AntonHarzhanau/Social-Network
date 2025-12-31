<?php

namespace App\Modules\Group\Domain\Repository;

use App\Modules\Group\Domain\Entity\GroupMember;

interface GroupMemberRepositoryInterface
{
    public function save(GroupMember $entity, bool $flush = true): void;

    public function delete(GroupMember $entity, bool $flush = true): void;

    public function findMembersByGroupId(string $groupId): array;
}
