<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\UserDirectoryInterface;
use App\Modules\Group\Domain\Entity\GroupMember;
use App\Modules\Group\Domain\Enum\GroupMemberRoleEnum;
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
        $group = $this->groupRepository->findById($currentUserId, $groupId);
        if ($group === null) {
            throw new \RuntimeException('Group not found');
        }

        $newMember = (new GroupMember())
            ->setUser($user)
            ->setGroup($group)
            ->setRole(GroupMemberRoleEnum::MEMBER);
        $this->groupMemberRepository->save($newMember);

        $group->setSubscribersCount($group->getSubscribersCount() + 1);
        $this->groupRepository->save($group);
    }
}
