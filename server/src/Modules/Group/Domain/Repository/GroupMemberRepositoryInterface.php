<?php

namespace App\Modules\Group\Domain\Repository;

use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use Symfony\Component\Uid\Uuid;

interface GroupMemberRepositoryInterface
{
    public function save(GroupMember $entity, bool $flush = true): void;

    public function delete(GroupMember $entity, bool $flush = true): void;

    public function findGroupMembers(
        Uuid $groupId, 
        ?GroupMemberStatusEnum $status = null, 
        ?GroupMemberRoleEnum $role = null, 
        int $page, 
        int $limit
    ): array;

    public function findOneByCriteria(array $criteria): ?GroupMember;

    public function countGroupMembers(Uuid $groupId): int;
}
