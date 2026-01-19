<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class SetGroupAvatarAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {}

    public function execute(Uuid $groupId, ?Uuid $avatarId, Uuid $currentUserId): string | null
    {
        $group = $this->groupRepository->findById($groupId);
        if ($group === null) {
            throw new \LogicException('Group not found');
        }

        if ($group->getOwner()->getId()->toRfc4122() !== $currentUserId->toRfc4122()) {
            throw new \LogicException('Only group owner can set avatar');
        }

        if (!$avatarId) {
            $group->setCurrentAvatar(null);
            $this->groupRepository->save($group);
            return null;
        }

        $avatar = $this->mediaDirectory->getMediaById($avatarId);
        if ($avatar === null) {
            throw new \LogicException('Avatar not found');
        }

        $group->setCurrentAvatar($avatar);;
        $this->groupRepository->save($group);

        return $group->getCurrentAvatar()?->getId()->toRfc4122() ?? '';
    }
}
