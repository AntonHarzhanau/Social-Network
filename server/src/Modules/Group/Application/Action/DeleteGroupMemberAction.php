<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteGroupMemberAction
{
    public function __construct(
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
    ) {
    }

    public function execute(Uuid $currentUser, Uuid $memberId): void
    {

        $member = $this->groupMemberRepository->findOneByCriteria(
            [
                'id' => $memberId,
            ]
        );

        if ($member === null) {
            throw new \LogicException('Group member not found');
        }
        $memberRole = $member->getRole();
        
        if ($memberRole === GroupMemberRoleEnum::OWNER) {
            throw new \LogicException('Cannot remove group owner');
        }

        $group = $member->getGroup();

                $currentMember = $this->groupMemberRepository->findOneByCriteria(
            [
                'group' => $group->getId(),
                'user' => $currentUser,
            ]
        );

        if (!$currentMember || $currentMember->getRole() === GroupMemberRoleEnum::MEMBER) {
            throw new \LogicException('Permission denied');
        }

        $this->groupMemberRepository->delete($member);
    }
}
