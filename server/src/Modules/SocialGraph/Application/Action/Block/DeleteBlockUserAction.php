<?php

namespace App\Modules\SocialGraph\Application\Action\Block;

use App\Modules\SocialGraph\Application\Port\UserDirectoryInterface;
use App\Modules\SocialGraph\Domain\Repository\UserBlockRepositoryInterface;
use Symfony\Component\Uid\Uuid;

final class DeleteBlockUserAction
{
    public function __construct(
        private readonly UserBlockRepositoryInterface $userBlockRepository,
        private readonly UserDirectoryInterface $userDirectory,
    ) {}

    public function execute(Uuid $blockedUserId, Uuid $currentUserId): void
    {
        if ($blockedUserId->equals($currentUserId)) {
            throw new \InvalidArgumentException('You cannot unblock yourself.');
        }
        $blocker = $this->userDirectory->getUser($currentUserId);
        $blocked = $this->userDirectory->getUser($blockedUserId);

        if (!$blocker || !$blocked) {
            throw new \InvalidArgumentException('User not found.');
        }

        $existingBlock = $this->userBlockRepository->findOneByBlockerAndBlocked($currentUserId, $blockedUserId);
        if (!$existingBlock) {
            throw new \InvalidArgumentException('Block not found.');
        }

        $this->userBlockRepository->remove($existingBlock);
    }
}
