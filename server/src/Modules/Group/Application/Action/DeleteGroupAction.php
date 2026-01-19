<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use App\Modules\User\Api\UserApiInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteGroupAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly UserApiInterface $userApi,
    ) {}

    public function execute(Uuid $currentUserId, Uuid $groupId): void
    {
        $user = $this->userApi->findById($currentUserId);
        if ($user === null) {
            throw new \RuntimeException('User not found');
        }

        $group = $this->groupRepository->findById($groupId);

        if ($group === null) {
            throw new \RuntimeException('Group not found');
        }

        if (!$group->getOwner()->getId()->equals($currentUserId)) {
            throw new \RuntimeException('You are not allowed to delete this group');
        }

        $this->groupRepository->delete($group);
    }
}
