<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class ChangeMemberStatusAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {
    }

    public function execute(Uuid $memberId, GroupMemberStatusEnum $newStatus, Uuid $currentUserId): void
    {

        $groupMember = $this->groupMemberRepository->findOneByCriteria(['id' => $memberId]);
        if ($groupMember === null) {
            throw new \RuntimeException('Group member not found');

        }

        $groupId = $groupMember->getGroup()->getId();
        
        $currentUserMember = $this->groupMemberRepository->findOneByCriteria([
            'group' => $groupId,
            'user' => $currentUserId,
        ]);
        if ($currentUserMember === null) {
            throw new \RuntimeException('Current user is not a member of the group');
        }

        if ($currentUserMember->getRole() === GroupMemberRoleEnum::MEMBER) {
            throw new \RuntimeException('Insufficient permissions to change member status');
        }

        $groupMember->setStatus($newStatus);
        $this->groupMemberRepository->save($groupMember);
    }
}
