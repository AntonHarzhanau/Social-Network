<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
use App\Modules\Group\Domain\Enum\GroupMemberStatusEnum;
use App\Modules\Group\Domain\Enum\GroupVisibilityEnum;
use App\Modules\Group\Domain\Repository\GroupMemberRepositoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class SubscribeGroupAction
{
    public function __construct(
        private readonly GroupMemberRepositoryInterface $groupMemberRepository,
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $groupId): void
    {
        $user = $this->userDirectory->findById($currentUserId);
        if ($user === null) {
            throw new \RuntimeException('User not found');
        }

        $group = $this->groupRepository->findById($groupId);
        if ($group === null) {
            throw new \RuntimeException('Group not found');
        }

        $existingMember = $this->groupMemberRepository->findOneByCriteria([
            'group' => $groupId,
            'user' => $currentUserId,
        ]);
        
        if ($existingMember !== null) {
            throw new \DomainException('User is already a member of this group.');
        }

        $newMember = (new GroupMember())
            ->setUser($user)
            ->setGroup($group)
            ->setRole(GroupMemberRoleEnum::MEMBER);

        if($group->getVisibility() === GroupVisibilityEnum::PUBLIC) {
            $newMember->setStatus(GroupMemberStatusEnum::ACCEPTED);
        } else {
            $newMember->setStatus(GroupMemberStatusEnum::PENDING);
        }

        $this->groupMemberRepository->save($newMember);

        $group->setSubscribersCount($group->getSubscribersCount() + 1);
        $this->groupRepository->save($group);
    }
}
