<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ChangeMemberRoleAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {
    }

    public function execute(Uuid $memberId, GroupMemberRoleEnum $newRole, Uuid $currentUserId): void
    {
        if ($newRole === GroupMemberRoleEnum::OWNER) {
            throw new \RuntimeException('Cannot assign OWNER role to another member');
        }

        $groupMember = $this->groupMemberRepository->findOneByCriteria(['id' => $memberId]);
        if ($groupMember === null) {
            throw new \RuntimeException('Group member not found');
        }

        if ($groupMember->getRole() === GroupMemberRoleEnum::OWNER) {
            throw new \RuntimeException('Cannot change role of the OWNER');
        }

        $groupId = $groupMember->getGroup()->getId();

        $currentUserMember = $this->groupMemberRepository->findOneByCriteria([
            'group' => $groupId,
            'user' => $currentUserId,
        ]);
        if ($currentUserMember === null) {
            throw new \RuntimeException('Current user is not a member of the group');
        }

        $currentUserRole = $currentUserMember->getRole();
        if ($currentUserRole === GroupMemberRoleEnum::MEMBER) {
            throw new \RuntimeException('Insufficient permissions to change roles');
        }

        $groupMember->setRole($newRole);
        $this->groupMemberRepository->save($groupMember);
    }
}
