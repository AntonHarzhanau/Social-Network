<?php

namespace App\Modules\Group\Application\Action;

use App\Modules\Group\Application\Port\MediaDirectoryInterface;
use App\Modules\Group\Domain\Repository\GroupRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class SetGroupCoverAction
{
    public function __construct(
        private readonly GroupRepositoryInterface $groupRepository,
        private readonly MediaDirectoryInterface $mediaDirectory,
    ) {}

    public function execute(Uuid $groupId, ?Uuid $coverId, Uuid $currentUserId): void
    {
        
        $group = $this->groupRepository->findById($groupId);
        if ($group === null) {
            throw new \RuntimeException('Group not found');
        }

        if ($group->getOwner()->getId()->toRfc4122() !== $currentUserId->toRfc4122()) {
            throw new \RuntimeException('Only group owner can set cover');
        }

        if (!$coverId) {
            $group->setCurrentCover(null);
            $this->groupRepository->save($group);
            return;
        }

        $cover = $this->mediaDirectory->getMediaById($coverId);
        if ($cover === null) {
            throw new \RuntimeException('Cover not found');
        }

        $group->setCurrentCover($cover);
        $this->groupRepository->save($group);
    }
}
