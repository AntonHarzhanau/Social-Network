<?php

namespace App\Modules\Group\Domain\Repository;

use App\Modules\Group\Domain\Entity\GroupMember;
use Symfony\Component\Uid\Uuid;

interface GroupMemberRepositoryInterface
{
    public function save(GroupMember $entity, bool $flush = true): void;

    public function delete(GroupMember $entity, bool $flush = true): void;

    public function findMembersByGroupId(Uuid $groupId): array;

    public function findOneByCriteria(array $criteria): ?GroupMember;
}
